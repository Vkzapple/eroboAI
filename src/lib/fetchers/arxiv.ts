// src/lib/fetchers/arxiv.ts
// Fetches research papers from arXiv API (free, no key needed)

import axios from 'axios'
import { parseStringPromise } from 'xml2js'
import type { ResearchField } from '@/types'

const BASE_URL = process.env.ARXIV_BASE_URL || 'https://export.arxiv.org/api/query'

// STEM queries relevant for Indonesian high school students
export const ARXIV_QUERIES = [
  { query: 'machine learning agriculture Indonesia', field: 'ai' as ResearchField },
  { query: 'IoT environmental monitoring low cost sensor', field: 'env' as ResearchField },
  { query: 'computer vision plant disease detection', field: 'ai' as ResearchField },
  { query: 'NLP bahasa Indonesia text classification', field: 'ai' as ResearchField },
  { query: 'renewable energy solar cell tropical climate', field: 'phys' as ResearchField },
  { query: 'bioplastic biodegradable natural materials', field: 'chem' as ResearchField },
  { query: 'CRISPR plant biology food security', field: 'bio' as ResearchField },
  { query: 'graph neural network epidemiology disease', field: 'math' as ResearchField },
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
  maxResults = 10
): Promise<ArxivPaper[]> {
  try {
    const params = new URLSearchParams({
      search_query: `all:${query}`,
      start: '0',
      max_results: String(maxResults),
      sortBy: 'submittedDate',
      sortOrder: 'descending',
    })

    const res = await axios.get(`${BASE_URL}?${params}`, {
      timeout: 15000,
      headers: { 'User-Agent': 'KIR-EROBO-AI/1.0 (educational; contact: kir.erobo@school.id)' }
    })

    const parsed = await parseStringPromise(res.data, { explicitArray: false })
    const feed = parsed?.feed
    if (!feed?.entry) return []

    const entries = Array.isArray(feed.entry) ? feed.entry : [feed.entry]

    return entries.map((entry: any): ArxivPaper => {
      const arxivId = entry.id?.replace('http://arxiv.org/abs/', '') || ''
      return {
        id: arxivId,
        arxiv_id: arxivId,
        title: entry.title?.replace(/\n/g, ' ').trim() || '',
        summary: entry.summary?.replace(/\n/g, ' ').trim() || '',
        authors: Array.isArray(entry.author)
          ? entry.author.map((a: any) => a.name)
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
    // Rate limit: 3s between requests (arXiv policy)
    await new Promise(r => setTimeout(r, 3000))
  }

  // Deduplicate by arxiv_id
  const seen = new Set<string>()
  return results.filter(p => {
    if (seen.has(p.arxiv_id)) return false
    seen.add(p.arxiv_id)
    return true
  })
}
