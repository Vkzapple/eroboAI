// src/lib/agent/pipeline.ts
// Agentic pipeline: Scheduler → Fetch → Dedup → AI → Store → Gap Regen → Display

import { fetchAllArxivPapers } from '@/lib/fetchers/arxiv'
import { fetchAllRSSFeeds } from '@/lib/fetchers/rss'
import { summarizePaper, detectResearchGaps, generateResearchIdeas, scoreRelevanceHeuristic } from '@/lib/ai/processor'
import { supabaseAdmin } from '@/lib/supabase'

export interface PipelineResult {
  success: boolean
  papers_fetched: number
  papers_new: number        // genuinely new papers not in DB before
  papers_stored: number
  gaps_found: number
  ideas_generated: number
  duration_ms: number
  error?: string
}

export async function runAgentPipeline(): Promise<PipelineResult> {
  const startTime = Date.now()
  let logId: string | null = null

  try {
    const { data } = await supabaseAdmin
      .from('agent_logs')
      .insert({ status: 'running' })
      .select('id')
      .single()
    logId = data?.id || null
  } catch {}

  const result: PipelineResult = {
    success: false,
    papers_fetched: 0,
    papers_new: 0,
    papers_stored: 0,
    gaps_found: 0,
    ideas_generated: 0,
    duration_ms: 0,
  }

  try {
    console.log('[Agent] ▶ Starting EROBO pipeline...')

    // ── STEP 1: Fetch from all sources ───────────────────────
    console.log('[Agent] Step 1: Fetching research data...')
    const [arxivPapers, rssItems] = await Promise.all([
      fetchAllArxivPapers(),
      fetchAllRSSFeeds(),
    ])
    console.log(`[Agent] Fetched: ${arxivPapers.length} arXiv + ${rssItems.length} RSS`)
    result.papers_fetched = arxivPapers.length + rssItems.length

    // Normalise into one list
    const allRaw = [
      ...arxivPapers.map(p => ({
        title: p.title,
        abstract: p.summary,
        url: p.url,
        source: 'arXiv',
        published_at: p.published,
        field: p.field,
        arxiv_id: p.arxiv_id,
        authors: p.authors,
      })),
      ...rssItems.map(r => ({
        title: r.title,
        abstract: r.summary,
        url: r.url,
        source: r.source,
        published_at: r.published,
        field: r.field,
        arxiv_id: undefined as string | undefined,
        authors: [] as string[],
      })),
    ]

    // ── STEP 2: Dedup — only process URLs not already in DB ──
    // ROOT FIX: previously ignoreDuplicates:true silently skipped
    // everything → processedPapers always empty → no new gaps ever.
    console.log('[Agent] Step 2: Checking for new papers...')
    const incomingUrls = allRaw.map(p => p.url)

    const { data: existingRows } = await supabaseAdmin
      .from('research_items')
      .select('url')
      .in('url', incomingUrls)

    const existingUrlSet = new Set((existingRows || []).map((r: any) => r.url))
    const newPapers = allRaw.filter(p => !existingUrlSet.has(p.url))
    result.papers_new = newPapers.length
    console.log(`[Agent] New papers (not in DB): ${newPapers.length} / ${allRaw.length}`)

    // ── STEP 3: AI summarise — only new papers ───────────────
    console.log('[Agent] Step 3: AI summarization of new papers...')
    const AI_BATCH_LIMIT = parseInt(process.env.DAILY_FETCH_LIMIT || '12')
    const toProcess = newPapers.slice(0, AI_BATCH_LIMIT)

    const processedPapers: any[] = []
    for (const paper of toProcess) {
      try {
        const aiResult = await summarizePaper(paper.title, paper.abstract)
        const heuristicScore = scoreRelevanceHeuristic(paper.title, paper.abstract)
        processedPapers.push({
          title: paper.title,
          source: paper.source,
          authors: paper.authors,
          url: paper.url,
          published_at: paper.published_at,
          field: paper.field,
          fields: aiResult.field_tags,
          summary_ai: aiResult.summary,
          summary_original: paper.abstract.slice(0, 1000),
          arxiv_id: paper.arxiv_id || null,
          relevance_score: Math.round((aiResult.relevance_score + heuristicScore) / 2),
          is_featured: aiResult.relevance_score >= 80,
        })
        // Respect Gemini free-tier rate limit
        await new Promise(r => setTimeout(r, 2500))
      } catch (err) {
        console.error(`[Agent] Failed to summarise: ${paper.title.slice(0, 50)}`, err)
      }
    }

    // ── STEP 4: Store new papers ──────────────────────────────
    console.log('[Agent] Step 4: Storing new papers...')
    if (processedPapers.length > 0) {
      const { data: stored, error } = await supabaseAdmin
        .from('research_items')
        .insert(processedPapers)   // plain INSERT — we already filtered duplicates above
        .select('id')

      result.papers_stored = stored?.length || 0
      if (error) console.error('[Agent] Store error:', error.message)
      else console.log(`[Agent] Stored ${result.papers_stored} new papers`)
    }

    // ── STEP 5: Regenerate gaps from LATEST papers in DB ─────
    // ROOT FIX: previously only used processedPapers (empty when no new papers).
    // Now always pull the freshest 30 papers from DB so gaps stay dynamic.
    console.log('[Agent] Step 5: Regenerating research gaps...')

    const { data: recentPapers } = await supabaseAdmin
      .from('research_items')
      .select('title, summary_ai, field')
      .order('created_at', { ascending: false })
      .limit(30)

    const papersForGapAnalysis = (recentPapers || [])
      .filter((p: any) => p.summary_ai && p.summary_ai.length > 20)
      .map((p: any) => ({ title: p.title, summary: p.summary_ai, field: p.field }))

    if (papersForGapAnalysis.length >= 5) {
      const detectedGaps = await detectResearchGaps(papersForGapAnalysis)
      result.gaps_found = detectedGaps.length
      console.log(`[Agent] Detected ${detectedGaps.length} gaps`)

      if (detectedGaps.length > 0) {
        // Delete stale gaps older than 3 days to keep Gap Finder fresh
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        await supabaseAdmin
          .from('research_gaps')
          .delete()
          .lt('created_at', threeDaysAgo)

        await supabaseAdmin.from('research_gaps').insert(detectedGaps)
      }
    } else {
      console.log('[Agent] Not enough papers for gap analysis, skipping')
    }

    // ── STEP 6: Generate ideas from latest gaps ───────────────
    console.log('[Agent] Step 6: Generating research ideas...')

    const { data: latestGaps } = await supabaseAdmin
      .from('research_gaps')
      .select('id, title, field, reason')
      .order('created_at', { ascending: false })
      .limit(5)

    if (latestGaps && latestGaps.length > 0) {
      const ideas = await generateResearchIdeas(latestGaps)
      result.ideas_generated = ideas.length

      if (ideas.length > 0) {
        // Similarly rotate old ideas
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        await supabaseAdmin
          .from('research_ideas')
          .delete()
          .lt('created_at', threeDaysAgo)

        await supabaseAdmin.from('research_ideas').insert(ideas)
      }
    }

    // ── DONE ─────────────────────────────────────────────────
    result.success = true
    result.duration_ms = Date.now() - startTime
    console.log(`[Agent] ✓ Pipeline complete in ${result.duration_ms}ms`)
    console.log(`[Agent] Summary: ${result.papers_new} new | ${result.papers_stored} stored | ${result.gaps_found} gaps | ${result.ideas_generated} ideas`)

  } catch (err: any) {
    result.error = err.message
    result.duration_ms = Date.now() - startTime
    console.error('[Agent] Pipeline failed:', err)
  }

  if (logId) {
    await supabaseAdmin.from('agent_logs').update({
      finished_at: new Date().toISOString(),
      status: result.success ? 'success' : 'failed',
      papers_fetched: result.papers_fetched,
      gaps_found: result.gaps_found,
      ideas_generated: result.ideas_generated,
      error: result.error || null,
    }).eq('id', logId)
  }

  return result
}