import { GoogleGenerativeAI } from '@google/generative-ai'
import { updateInsteek } from '@powned/database'
import { INSTEEK_PROMPT } from './powned-dna'
import type { NewsItem, DnaScore, Insteek } from '@powned/database'

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY || 'placeholder'
  return new GoogleGenerativeAI(apiKey)
}

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
  const model = getClient().getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `${INSTEEK_PROMPT}

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

Genereer een volledige redactie-insteek.`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  const raw = parseJsonFromResponse(text)
  const insteek = validateInsteek(raw)

  await updateInsteek(item.id, insteek)

  return insteek
}
