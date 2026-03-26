// src/app/api/research/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const field = searchParams.get('field')
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('per_page') || '12')
  const featured = searchParams.get('featured') === 'true'

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('research_items')
    .select('*', { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(from, to)

  if (field && field !== 'semua') query = query.eq('field', field)
  if (featured) query = query.eq('is_featured', true)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data,
    meta: {
      total: count || 0,
      page,
      per_page: perPage,
      last_updated: data?.[0]?.created_at || null,
    },
  }, {
    headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' }
  })
}
