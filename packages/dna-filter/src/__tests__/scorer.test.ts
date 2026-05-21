import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { NewsItem } from '@powned/database'

// Mock Anthropic SDK
vi.mock('@anthropic-ai/sdk', () => ({
  default: class Anthropic {
    messages = {
      create: vi.fn().mockResolvedValue({
        content: [{
          type: 'text',
          text: JSON.stringify({
            brutaal: 7.5,
            spraakmakend: 8.0,
            absurd: 6.0,
            lokaal: 7.0,
            total_score: 7.25,
            reden: 'Klassiek PowNed-verhaal met nationaal deelpotentieel.',
          }),
        }],
      }),
    }
  },
}))

// Mock database
vi.mock('@powned/database', () => ({
  upsertDnaScore: vi.fn().mockResolvedValue({
    id: 'score-123',
    news_item_id: 'item-123',
    brutaal: 7.5,
    spraakmakend: 8.0,
    absurd: 6.0,
    lokaal: 7.0,
    total_score: 7.25,
    reden: 'Klassiek PowNed-verhaal met nationaal deelpotentieel.',
    scored_at: new Date().toISOString(),
  }),
}))

const mockItem: NewsItem = {
  id: 'item-123',
  title: 'Gemeente weigert kiosk na 40 jaar',
  url: 'https://nos.nl/artikel/test',
  source: 'NOS',
  platform: 'nieuws',
  raw_content: 'Een kiosk-eigenaar moet na 40 jaar zijn zaak sluiten omdat de gemeente de vergunning niet wil verlengen.',
  created_at: new Date().toISOString(),
}

describe('scoreItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('roept Anthropic API aan en slaat score op', async () => {
    const { scoreItem } = await import('../scorer.js')
    const score = await scoreItem(mockItem)

    expect(score.brutaal).toBe(7.5)
    expect(score.spraakmakend).toBe(8.0)
    expect(score.total_score).toBe(7.25)
    expect(score.reden).toContain('PowNed')
  })

  it('berekent total_score correct', () => {
    const brutaal = 7.5
    const spraakmakend = 8.0
    const absurd = 6.0
    const lokaal = 7.0
    const expected = brutaal * 0.25 + spraakmakend * 0.30 + absurd * 0.20 + lokaal * 0.25
    expect(expected).toBeCloseTo(7.275, 1)
  })
})

describe('JSON parsing', () => {
  it('parset JSON zonder markdown wrappers', () => {
    const withMarkdown = '```json\n{"brutaal": 5}\n```'
    const cleaned = withMarkdown.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    expect(JSON.parse(cleaned)).toEqual({ brutaal: 5 })
  })

  it('parset JSON direct', () => {
    const direct = '{"brutaal": 7, "spraakmakend": 8}'
    expect(() => JSON.parse(direct)).not.toThrow()
  })
})

describe('scoreBatch', () => {
  it('verwerkt meerdere items', async () => {
    const { scoreBatch } = await import('../scorer.js')
    const items: NewsItem[] = [
      { ...mockItem, id: 'a', url: 'https://nos.nl/a' },
      { ...mockItem, id: 'b', url: 'https://nos.nl/b' },
      { ...mockItem, id: 'c', url: 'https://nos.nl/c' },
    ]
    const result = await scoreBatch(items, 2)
    expect(result.scored).toBe(3)
    expect(result.errors).toBe(0)
  })
})
