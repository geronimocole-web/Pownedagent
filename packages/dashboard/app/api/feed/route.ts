import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const platform = searchParams.get('platform') ?? 'alles'
  const minScore = Number(searchParams.get('minScore') ?? '0')
  const limit    = Number(searchParams.get('limit') ?? '50')
  const offset   = Number(searchParams.get('offset') ?? '0')

  try {
    const { getFeedItems } = await import('@powned/database')
    const items = await getFeedItems({ platform, minScore, limit, offset })
    return NextResponse.json({ items })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
