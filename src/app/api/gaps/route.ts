// src/app/api/gaps/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const level = searchParams.get('level')
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('per_page') || '10')

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('research_gaps')
    .select('*', { count: 'exact' })
    .order('relevance_score', { ascending: false })
    .range(from, to)

  if (level && level !== 'semua') query = query.eq('level', level)

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data, meta: { total: count || 0, page, per_page: perPage } }, {
    headers: { 'Cache-Control': 's-maxage=600, stale-while-revalidate=1200' }
  })
}
