import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { IS_DEMO_MODE, MOCK_ITEMS } from '../../../lib/mock-data'

export async function POST(request: NextRequest) {
  // Demo mode: simuleer een scrape zonder echte API-aanroepen
  if (IS_DEMO_MODE) {
    await new Promise(resolve => setTimeout(resolve, 1200)) // realistisch laadgevoel
    return NextResponse.json({
      success: true,
      found: MOCK_ITEMS.length,
      saved: 3,
      scored: 3,
      errors: 0,
      demo: true,
      timestamp: new Date().toISOString(),
    })
  }

  // Productie: Bearer token vereist
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET niet ingesteld' }, { status: 500 })
  }

  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
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
