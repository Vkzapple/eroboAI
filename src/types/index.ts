// src/types/index.ts

export type ResearchField = 'ai' | 'bio' | 'env' | 'phys' | 'math' | 'rob' | 'chem' | 'other'

export interface ResearchItem {
  id: string
  title: string
  source: string
  authors?: string[]
  url: string
  published_at: string
  field: ResearchField
  fields: string[]
  summary_ai: string       // AI-generated Bahasa Indonesia summary
  summary_original: string // Original abstract
  arxiv_id?: string
  relevance_score: number  // 0-100, how relevant for SMA students
  is_featured: boolean
  created_at: string
}

export interface ResearchGap {
  id: string
  title: string
  field: string
  related_fields: string[]
  reason: string           // Why this is a gap
  opportunity: string      // What students can do
  difficulty: 'mudah' | 'sedang' | 'sulit'
  level: 'kritis' | 'moderat' | 'baru' | 'rendah'
  relevance_score: number
  tags: string[]
  source_papers: string[]  // IDs of papers that reveal this gap
  generated_at: string
  created_at: string
}

export interface ResearchIdea {
  id: string
  title: string
  gap_id?: string
  field: ResearchField
  tags: string[]
  description: string
  methodology: string
  expected_outcome: string
  difficulty: 'mudah' | 'sedang' | 'sulit'
  feasibility_score: number  // 0-100
  originality_score: number  // 0-100
  created_at: string
}

export interface AgentRunLog {
  id: string
  started_at: string
  finished_at?: string
  status: 'running' | 'success' | 'failed'
  papers_fetched: number
  gaps_found: number
  ideas_generated: number
  error?: string
}

export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    page: number
    per_page: number
    last_updated: string
  }
  error?: string
}
