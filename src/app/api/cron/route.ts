// src/app/api/cron/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { runAgentPipeline } from '@/lib/agent/pipeline'

export const maxDuration = 300

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const { searchParams } = new URL(req.url)
  const querySecret = searchParams.get('secret')
  const cronSecret = process.env.CRON_SECRET

  const isAuthorized =
    !cronSecret ||
    authHeader === `Bearer ${cronSecret}` ||
    querySecret === cronSecret

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const triggeredAt = new Date().toISOString()
  console.log('[Cron] EROBO agent triggered at', triggeredAt)

  // Return immediately — pipeline runs in background
  // This prevents Vercel free tier 10s timeout from killing the job
  runAgentPipeline()
    .then(result => {
      console.log('[Cron] Pipeline finished:', JSON.stringify({
        success: result.success,
        papers_new: result.papers_new,
        papers_stored: result.papers_stored,
        gaps_found: result.gaps_found,
        ideas_generated: result.ideas_generated,
        duration_ms: result.duration_ms,
      }))
    })
    .catch(err => {
      console.error('[Cron] Pipeline error:', err.message)
    })

  return NextResponse.json({
    ok: true,
    message: 'Pipeline started. Check Supabase → agent_logs in ~3 minutes for results.',
    triggered_at: triggeredAt,
    check: 'https://supabase.com → Table Editor → agent_logs',
  })
}

export async function POST(req: NextRequest) {
  return GET(req)
}