import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock database
vi.mock('@powned/database', () => ({
  getFeedItems: vi.fn().mockResolvedValue([]),
  getItemById:  vi.fn().mockResolvedValue(null),
}))

// Mock scraper + filter
vi.mock('@powned/scraper', () => ({
  runScraper: vi.fn().mockResolvedValue({ found: 10, saved: 5 }),
}))

vi.mock('@powned/dna-filter', () => ({
  scoreBatch:      vi.fn().mockResolvedValue({ scored: 5, errors: 0 }),
  generateInsteek: vi.fn().mockResolvedValue({ opening: 'Test opening' }),
}))

// Zet CRON_SECRET
process.env.CRON_SECRET = 'test-secret-123'

describe('POST /api/scrape', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('weigert zonder auth header', async () => {
    const { POST } = await import('../app/api/scrape/route')
    const req = new NextRequest('http://localhost/api/scrape', { method: 'POST' })
    const res = await POST(req)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toContain('Ongeautoriseerd')
  })

  it('weigert met verkeerd token', async () => {
    const { POST } = await import('../app/api/scrape/route')
    const req = new NextRequest('http://localhost/api/scrape', {
      method: 'POST',
      headers: { Authorization: 'Bearer verkeerd-token' },
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('accepteert correct token en draait scraper', async () => {
    const { POST } = await import('../app/api/scrape/route')
    const req = new NextRequest('http://localhost/api/scrape', {
      method: 'POST',
      headers: { Authorization: 'Bearer test-secret-123' },
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.found).toBe(10)
    expect(body.saved).toBe(5)
  })
})

describe('POST /api/insteek/[id]', () => {
  it('geeft 404 voor onbekend item', async () => {
    const { POST } = await import('../app/api/insteek/[id]/route')
    const req = new NextRequest('http://localhost/api/insteek/onbekend', { method: 'POST' })
    const res = await POST(req, { params: { id: 'onbekend' } })
    expect(res.status).toBe(404)
  })

  it('genereert insteek voor item met score', async () => {
    const { getItemById } = await import('@powned/database')
    vi.mocked(getItemById).mockResolvedValueOnce({
      id: 'item-1',
      title: 'Test artikel',
      url: 'https://nos.nl/1',
      source: 'NOS',
      platform: 'nieuws',
      total_score: 7.5,
      brutaal: 7,
      spraakmakend: 8,
      absurd: 6,
      lokaal: 7,
      reden: 'Goed verhaal',
      created_at: new Date().toISOString(),
    } as any)

    const { POST } = await import('../app/api/insteek/[id]/route')
    const req = new NextRequest('http://localhost/api/insteek/item-1', { method: 'POST' })
    const res = await POST(req, { params: { id: 'item-1' } })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.insteek.opening).toBe('Test opening')
  })
})
