// src/lib/fetchers/arxiv.ts
import axios from 'axios'
import { parseStringPromise } from 'xml2js'
import type { ResearchField } from '@/types'

const BASE_URL = process.env.ARXIV_BASE_URL || 'https://export.arxiv.org/api/query'

// Dikurangi jadi 4 query paling relevan (hemat waktu & quota)
export const ARXIV_QUERIES = [
  { query: 'cat:cs.AI+OR+cat:cs.LG', field: 'ai' as ResearchField },
  { query: 'cat:eess.SP+low+cost+sensor+environment', field: 'env' as ResearchField },
  { query: 'cat:q-bio+Indonesia+OR+tropical', field: 'bio' as ResearchField },
  { query: 'cat:physics+renewable+energy+solar', field: 'phys' as ResearchField },
]

export interface ArxivPaper {
  id: string
  title: string
  summary: string
  authors: string[]
  published: string
  url: string
  arxiv_id: string
  field: ResearchField
}

export async function fetchArxivPapers(
  query: string,
  field: ResearchField,
  maxResults = 8
): Promise<ArxivPaper[]> {
  try {
    // Filter hanya 7 hari terakhir
    const params = new URLSearchParams({
      search_query: query,
      start: '0',
      max_results: String(maxResults),
      sortBy: 'submittedDate',
      sortOrder: 'descending',
    })

    const res = await axios.get(`${BASE_URL}?${params}`, {
      timeout: 10000,
      headers: { 'User-Agent': 'KIR-EROBO-AI/1.0 (educational)' }
    })

    const parsed = await parseStringPromise(res.data, { explicitArray: false })
    const feed = parsed?.feed
    if (!feed?.entry) return []

    const entries = Array.isArray(feed.entry) ? feed.entry : [feed.entry]

    // Filter hanya paper 7 hari terakhir
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    return entries
      .filter((entry: any) => {
        const published = new Date(entry.published || '')
        return published >= sevenDaysAgo
      })
      .map((entry: any): ArxivPaper => {
        const arxivId = entry.id?.replace('http://arxiv.org/abs/', '')
          .replace('https://arxiv.org/abs/', '') || ''
        return {
          id: arxivId,
          arxiv_id: arxivId,
          title: entry.title?.replace(/\n/g, ' ').trim() || '',
          summary: entry.summary?.replace(/\n/g, ' ').trim() || '',
          authors: Array.isArray(entry.author)
            ? entry.author.slice(0, 3).map((a: any) => a.name)
            : [entry.author?.name || 'Unknown'],
          published: entry.published || new Date().toISOString(),
          url: `https://arxiv.org/abs/${arxivId}`,
          field,
        }
      })
  } catch (err) {
    console.error(`[arXiv] Error fetching "${query}":`, err)
    return []
  }
}

export async function fetchAllArxivPapers(): Promise<ArxivPaper[]> {
  const results: ArxivPaper[] = []

  for (const { query, field } of ARXIV_QUERIES) {
    const papers = await fetchArxivPapers(query, field, 8)
    results.push(...papers)
    // 1 detik saja — cukup untuk rate limit arXiv
    await new Promise(r => setTimeout(r, 1000))
  }

  // Deduplicate
  const seen = new Set<string>()
  return results.filter(p => {
    if (seen.has(p.arxiv_id)) return false
    seen.add(p.arxiv_id)
    return true
  })
}