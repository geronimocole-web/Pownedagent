import OpenAI from 'openai'
import { updateInsteek } from '@powned/database'
import { INSTEEK_PROMPT } from './powned-dna'
import type { NewsItem, DnaScore, Insteek } from '@powned/database'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'placeholder' })

function parseJsonFromResponse(text: string): unknown {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned)
}

function validateInsteek(raw: unknown): Insteek {
  const i = raw as Insteek
  if (!i.opening || !Array.isArray(i.invalshoeken) || !Array.isArray(i.vragen)) {
    throw new Error('Ongeldig insteek-formaat ontvangen van AI')
  }
  return i
}

/** Genereert een volledige redactie-insteek voor een nieuwsitem */
export async function generateInsteek(
  item: NewsItem,
  score: DnaScore
): Promise<Insteek> {
  const userMessage = `
Nieuwsitem:
Titel: ${item.title}
Bron: ${item.source ?? 'Onbekend'}
Platform: ${item.platform ?? 'Onbekend'}
Inhoud: ${(item.raw_content ?? '').slice(0, 800)}

PowNed DNA Score:
- Brutaal: ${score.brutaal}/10
- Spraakmakend: ${score.spraakmakend}/10
- Absurd: ${score.absurd}/10
- Lokaal: ${score.lokaal}/10
- Totaal: ${score.total_score}/10
- Reden: ${score.reden ?? '-'}

Genereer een volledige redactie-insteek.`.trim()

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 2048,
    messages: [
      { role: 'system', content: INSTEEK_PROMPT },
      { role: 'user', content: userMessage },
    ],
  })

  const text = response.choices[0].message.content ?? ''
  const raw = parseJsonFromResponse(text)
  const insteek = validateInsteek(raw)

  await updateInsteek(item.id, insteek)

  return insteek
}
