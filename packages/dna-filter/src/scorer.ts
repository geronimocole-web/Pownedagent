import OpenAI from 'openai'
import { upsertDnaScore } from '@powned/database'
import { POWNED_DNA_PROMPT } from './powned-dna'
import type { NewsItem, DnaScore } from '@powned/database'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder',
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
})

interface RawScore {
  brutaal: number
  spraakmakend: number
  absurd: number
  lokaal: number
  total_score: number
  reden: string
}

function validateScore(raw: unknown): RawScore {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Score is geen object')
  }
  const s = raw as Record<string, unknown>
  const dims = ['brutaal', 'spraakmakend', 'absurd', 'lokaal', 'total_score']
  for (const dim of dims) {
    if (typeof s[dim] !== 'number' || s[dim] < 0 || s[dim] > 10) {
      throw new Error(`Ongeldige waarde voor ${dim}: ${s[dim]}`)
    }
  }
  return s as unknown as RawScore
}

function parseJsonFromResponse(text: string): unknown {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned)
}

/** Scoort één nieuwsitem via OpenAI API */
export async function scoreItem(item: NewsItem): Promise<DnaScore> {
  const userMessage = `Titel: ${item.title}\n\nInhoud: ${(item.raw_content ?? '').slice(0, 500)}`

  const response = await client.chat.completions.create({
    model: 'gemini-2.0-flash',
    max_tokens: 512,
    messages: [
      { role: 'system', content: POWNED_DNA_PROMPT },
      { role: 'user', content: userMessage },
    ],
  })

  const text = response.choices[0].message.content ?? ''
  const raw = parseJsonFromResponse(text)
  const validated = validateScore(raw)

  const score = await upsertDnaScore({
    news_item_id: item.id,
    brutaal:      validated.brutaal,
    spraakmakend: validated.spraakmakend,
    absurd:       validated.absurd,
    lokaal:       validated.lokaal,
    total_score:  validated.total_score,
    reden:        validated.reden,
  })

  return score
}

/** Scoort een batch items met rate limiting */
export async function scoreBatch(
  items: NewsItem[],
  concurrency = 5
): Promise<{ scored: number; errors: number }> {
  let scored = 0
  let errors = 0

  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency)
    await Promise.all(chunk.map(async item => {
      try {
        await scoreItem(item)
        scored++
        console.log(`[scorer] ✓ ${item.title.slice(0, 60)}`)
      } catch (err) {
        errors++
        console.error(`[scorer] ✗ ${item.title.slice(0, 60)}:`, (err as Error).message)
      }
    }))
  }

  return { scored, errors }
}
