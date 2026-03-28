// src/app/api/cron/route.ts
// Triggered daily by Vercel Cron or external cron service
// Vercel cron config: vercel.json → "crons": [{"path": "/api/cron", "schedule": "0 0 * * *"}]

import { NextRequest, NextResponse } from 'next/server'
import { runAgentPipeline } from '@/lib/agent/pipeline'

export const maxDuration = 300 // 5 minutes (Vercel Pro limit)

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const { searchParams } = new URL(req.url)
  const querySecret = searchParams.get('secret')
  const cronSecret = process.env.CRON_SECRET

  // Izinkan akses via: header Authorization ATAU query param ?secret=
  const isAuthorized =
    !cronSecret ||                                    // tidak ada secret = bebas
    authHeader === `Bearer ${cronSecret}` ||          // via header
    querySecret === cronSecret                        // via ?secret= di URL

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[Cron] Daily EROBO agent triggered at', new Date().toISOString())

  const result = await runAgentPipeline()

  return NextResponse.json({
    ok: result.success,
    message: result.success
      ? `Pipeline done: ${result.papers_stored} papers, ${result.gaps_found} gaps, ${result.ideas_generated} ideas`
      : `Pipeline failed: ${result.error}`,
    result,
    timestamp: new Date().toISOString(),
  })
}

// Also allow POST for manual triggering from dashboard
export async function POST(req: NextRequest) {
  return GET(req)
}
