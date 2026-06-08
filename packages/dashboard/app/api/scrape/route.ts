import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  // Toegang via Bearer token (Vercel cron) OF via sessie-cookie (dashboard knop)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const sessionCookie = request.cookies.get('powned_session')?.value

  const hasBearerAuth = cronSecret && authHeader === `Bearer ${cronSecret}`
  const hasSessionAuth = !!sessionCookie  // middleware heeft al geverifieerd dat de sessie geldig is

  if (!hasBearerAuth && !hasSessionAuth) {
    return NextResponse.json({ error: 'Ongeautoriseerd' }, { status: 401 })
  }

  try {
    const { runScraper } = await import('@powned/scraper')
    const { getUnscoredItems } = await import('@powned/database')
    const { scoreBatch } = await import('@powned/dna-filter')

    const { found, saved } = await runScraper()
    const unscoredItems = await getUnscoredItems(50)
    const { scored, errors } = await scoreBatch(unscoredItems, 3)

    return NextResponse.json({
      success: true,
      found,
      saved,
      scored,
      errors,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[api/scrape] Fout:', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
