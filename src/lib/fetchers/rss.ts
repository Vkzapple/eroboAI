// src/lib/fetchers/rss.ts
import Parser from 'rss-parser'
import type { ResearchField } from '@/types'

const parser = new Parser({ timeout: 8000, headers: { 'User-Agent': 'KIR-EROBO-AI/1.0' } })

export interface RSSItem {
  id: string
  title: string
  summary: string
  url: string
  published: string
  source: string
  field: ResearchField
}

// Dikurangi jadi 3 source paling stabil
export const RSS_SOURCES = [
  {
    name: 'ScienceDaily · AI',
    url: 'https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml',
    field: 'ai' as ResearchField,
  },
  {
    name: 'ScienceDaily · Environment',
    url: 'https://www.sciencedaily.com/rss/earth_climate/environmental_science.xml',
    field: 'env' as ResearchField,
  },
  {
    name: 'ScienceDaily · Biology',
    url: 'https://www.sciencedaily.com/rss/plants_animals/biology.xml',
    field: 'bio' as ResearchField,
  },
]

export async function fetchRSSFeed(
  url: string,
  sourceName: string,
  field: ResearchField,
  limit = 6
): Promise<RSSItem[]> {
  try {
    const feed = await parser.parseURL(url)

    // Filter 7 hari terakhir
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    return feed.items
      .filter(item => {
        const pub = new Date(item.isoDate || item.pubDate || '')
        return pub >= sevenDaysAgo
      })
      .slice(0, limit)
      .map((item, idx) => ({
        id: item.guid || item.link || `${sourceName}-${idx}`,
        title: item.title || '',
        summary: item.contentSnippet || item.content || item.summary || '',
        url: item.link || '',
        published: item.isoDate || item.pubDate || new Date().toISOString(),
        source: sourceName,
        field,
      }))
  } catch (err) {
    console.error(`[RSS] Error fetching ${sourceName}:`, err)
    return []
  }
}

export async function fetchAllRSSFeeds(): Promise<RSSItem[]> {
  // Fetch semua paralel — lebih cepat dari sequential
  const results = await Promise.allSettled(
    RSS_SOURCES.map(src => fetchRSSFeed(src.url, src.name, src.field, 6))
  )

  return results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => (r as PromiseFulfilledResult<RSSItem[]>).value)
}