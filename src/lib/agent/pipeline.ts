// src/lib/agent/pipeline.ts
// Main agentic pipeline:
// Scheduler → Fetch → AI Process → Store → Ready to display

import { fetchAllArxivPapers } from '@/lib/fetchers/arxiv'
import { fetchAllRSSFeeds } from '@/lib/fetchers/rss'
import { summarizePaper, detectResearchGaps, generateResearchIdeas, scoreRelevanceHeuristic } from '@/lib/ai/processor'
import { supabaseAdmin } from '@/lib/supabase'

export interface PipelineResult {
  success: boolean
  papers_fetched: number
  papers_stored: number
  gaps_found: number
  ideas_generated: number
  duration_ms: number
  error?: string
}

export async function runAgentPipeline(): Promise<PipelineResult> {
  const startTime = Date.now()
  let logId: string | null = null

  // Create agent run log
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
    papers_stored: 0,
    gaps_found: 0,
    ideas_generated: 0,
    duration_ms: 0,
  }

  try {
    console.log('[Agent] ▶ Starting EROBO pipeline...')

    // ── STEP 1: Fetch data from all sources ──────────────────
    console.log('[Agent] Step 1: Fetching research data...')
    const [arxivPapers, rssItems] = await Promise.all([
      fetchAllArxivPapers(),
      fetchAllRSSFeeds(),
    ])

    console.log(`[Agent] Fetched: ${arxivPapers.length} arXiv + ${rssItems.length} RSS`)
    result.papers_fetched = arxivPapers.length + rssItems.length

    // ── STEP 2: AI Processing — summarize papers ─────────────
    console.log('[Agent] Step 2: AI summarization...')

    const processedPapers = []
    const AI_BATCH_LIMIT = parseInt(process.env.DAILY_FETCH_LIMIT || '8')
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
        arxiv_id: undefined,
        authors: [],
      })),
    ].slice(0, AI_BATCH_LIMIT)

    for (const paper of allRaw) {
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

        // Respect AI rate limits — 2s between calls
        await new Promise(r => setTimeout(r, 2000))
      } catch (err) {
        console.error(`[Agent] Failed to process: ${paper.title.slice(0, 50)}`, err)
      }
    }

    // ── STEP 3: Store papers in Supabase ─────────────────────
    console.log('[Agent] Step 3: Storing papers...')

    if (processedPapers.length > 0) {
      const { data: stored, error } = await supabaseAdmin
        .from('research_items')
        .upsert(processedPapers, {
          onConflict: 'url',
          ignoreDuplicates: true,
        })
        .select('id')

      result.papers_stored = stored?.length || 0
      if (error) console.error('[Agent] Store error:', error.message)
    }

    // ── STEP 4: Detect research gaps via AI ──────────────────
    console.log('[Agent] Step 4: Detecting research gaps...')

    const papersForGapAnalysis = processedPapers
      .filter(p => p.relevance_score > 60)
      .map(p => ({ title: p.title, summary: p.summary_ai, field: p.field }))

    const detectedGaps = await detectResearchGaps(papersForGapAnalysis)
    result.gaps_found = detectedGaps.length

    if (detectedGaps.length > 0) {
      await supabaseAdmin
        .from('research_gaps')
        .insert(detectedGaps)
    }

    // ── STEP 5: Generate research ideas ──────────────────────
    console.log('[Agent] Step 5: Generating research ideas...')

    const { data: latestGaps } = await supabaseAdmin
      .from('research_gaps')
      .select('id, title, field, reason')
      .order('created_at', { ascending: false })
      .limit(5)

    if (latestGaps && latestGaps.length > 0) {
      const ideas = await generateResearchIdeas(latestGaps)
      result.ideas_generated = ideas.length

      if (ideas.length > 0) {
        await supabaseAdmin.from('research_ideas').insert(ideas)
      }
    }

    // ── DONE ─────────────────────────────────────────────────
    result.success = true
    result.duration_ms = Date.now() - startTime
    console.log(`[Agent] ✓ Pipeline complete in ${result.duration_ms}ms`)

  } catch (err: any) {
    result.error = err.message
    result.duration_ms = Date.now() - startTime
    console.error('[Agent] Pipeline failed:', err)
  }

  // Update agent log
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