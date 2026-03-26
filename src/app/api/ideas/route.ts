// src/app/api/ideas/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const field = searchParams.get('field')
  const perPage = parseInt(searchParams.get('per_page') || '10')

  let query = supabase
    .from('research_ideas')
    .select('*', { count: 'exact' })
    .order('feasibility_score', { ascending: false })
    .limit(perPage)

  if (field && field !== 'semua') query = query.eq('field', field)

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data, meta: { total: count || 0 } }, {
    headers: { 'Cache-Control': 's-maxage=600, stale-while-revalidate=1200' }
  })
}
