// src/app/research/page.tsx
import { supabase } from '@/lib/supabase'
import { ResearchClientPage } from './ResearchClientPage'

export const revalidate = 300

async function getData() {
  const [itemsRes, logRes] = await Promise.all([
    supabase.from('research_items').select('*').order('published_at', { ascending: false }).limit(24),
    supabase.from('agent_logs').select('finished_at,papers_fetched').eq('status','success').order('finished_at',{ascending:false}).limit(1).single(),
  ])
  const items = itemsRes.data || []
  const fieldCounts: Record<string,number> = {}
  items.forEach((i:any) => { fieldCounts[i.field] = (fieldCounts[i.field]||0)+1 })
  return { items, fieldCounts, lastRun: logRes.data }
}

export default async function ResearchPage() {
  const { items, fieldCounts, lastRun } = await getData()
  return <ResearchClientPage initialItems={items} fieldCounts={fieldCounts} lastRun={lastRun} />
}
