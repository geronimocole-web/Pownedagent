import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { IS_DEMO_MODE } from '../../../../lib/mock-data'
import type { Insteek } from '@powned/database'

const DEMO_INSTEEK: Insteek = {
  opening: 'Dit is een verhaal dat Nederland wakker schudt. PowNed duikt in de feiten en legt bloot wat niemand durft te zeggen.',
  invalshoeken: [
    { titel: 'De menselijke kant', beschrijving: 'Wie zijn de mensen achter dit verhaal? Wat betekent het voor gewone Nederlanders?' },
    { titel: 'De politieke dimensie', beschrijving: 'Wie draagt verantwoordelijkheid? Welke partijen reageren en hoe?' },
    { titel: 'Het absurde element', beschrijving: 'Wat maakt dit verhaal zo PowNed-waardig? De twist die niemand zag aankomen.' },
  ],
  vragen: [
    { vraag: 'Hoe is dit in hemelsnaam zo ver kunnen komen?', type: 'confronterend' },
    { vraag: 'Wat doet de overheid hier nu precies aan?', type: 'context' },
    { vraag: 'Herken jij dit uit je eigen omgeving?', type: 'publiek' },
  ],
  sprekers: [
    { naam: 'Expert ter zake', rol: 'Specialist op dit gebied', waarom: 'Geeft context en duiding bij de feiten' },
    { naam: 'Direct betrokkene', rol: 'Ervaringsdeskundige', waarom: 'Het persoonlijke verhaal achter het nieuws' },
  ],
  shots: [
    'Opkomst met nieuwsitem op scherm',
    'Straatinterviews met omstanders',
    'Archief-/illustratiemateriaal van de locatie',
    'Talking head expert in studio',
  ],
  formaat: {
    type: 'nieuwsitem',
    lengte: '2-3 minuten',
    toon: 'direct en confronterend',
    social_cut: 'De meest spraakmakende uitspraak als 30s clip voor Instagram/TikTok',
  },
  urgentie: {
    niveau: 'hoog',
    toelichting: 'Dit verhaal speelt nu en vraagt om directe aandacht. Ideaal voor de eerstvolgende uitzending.',
  },
}

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  if (IS_DEMO_MODE) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    return NextResponse.json({ insteek: DEMO_INSTEEK, demo: true })
  }

  try {
    const { getItemById } = await import('@powned/database')
    const { generateInsteek } = await import('@powned/dna-filter')

    const item = await getItemById(id)
    if (!item) {
      return NextResponse.json({ error: 'Item niet gevonden' }, { status: 404 })
    }

    if (!item.total_score) {
      return NextResponse.json({ error: 'Item heeft nog geen DNA score' }, { status: 422 })
    }

    const score = {
      id: '',
      news_item_id: item.id,
      brutaal: item.brutaal ?? 0,
      spraakmakend: item.spraakmakend ?? 0,
      absurd: item.absurd ?? 0,
      lokaal: item.lokaal ?? 0,
      total_score: item.total_score,
      reden: item.reden,
      scored_at: item.scored_at ?? new Date().toISOString(),
    }

    const insteek = await generateInsteek(item, score)
    return NextResponse.json({ insteek })
  } catch (err) {
    console.error('[api/insteek] Fout:', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
