// src/lib/fetchers/rss.ts
// Fetches from RSS feeds: ScienceDaily, Nature, IEEE

import Parser from 'rss-parser'
import type { ResearchField } from '@/types'

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'KIR-EROBO-AI/1.0' },
})

export interface RSSItem {
  id: string
  title: string
  summary: string
  url: string
  published: string
  source: string
  field: ResearchField
}

// RSS feed sources configuration
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
  {
    name: 'Nature · Sustainability',
    url: 'https://www.nature.com/natsustain.rss',
    field: 'env' as ResearchField,
  },
  {
    name: 'Nature · Biotechnology',
    url: 'https://www.nature.com/nbt.rss',
    field: 'bio' as ResearchField,
  },
]

export async function fetchRSSFeed(
  url: string,
  sourceName: string,
  field: ResearchField,
  limit = 10
): Promise<RSSItem[]> {
  try {
    const feed = await parser.parseURL(url)
    return feed.items.slice(0, limit).map((item, idx) => ({
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
  const results: RSSItem[] = []

  for (const src of RSS_SOURCES) {
    const items = await fetchRSSFeed(src.url, src.name, src.field, 8)
    results.push(...items)
    await new Promise(r => setTimeout(r, 1000))
  }

  return results
}
