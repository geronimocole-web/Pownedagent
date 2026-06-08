import { createClient } from '@supabase/supabase-js'

// ============================================================
// Types
// ============================================================

export interface Source {
  id: string
  name: string
  url: string
  type: 'rss' | 'sitemap' | 'reddit'
  active: boolean
  created_at: string
}

export interface NewsItem {
  id: string
  title: string
  url: string
  source?: string
  platform?: 'nieuws' | 'twitter' | 'reddit' | 'overig'
  published_at?: string
  raw_content?: string
  image_url?: string
  created_at: string
}

export interface DnaScore {
  id: string
  news_item_id: string
  brutaal: number
  spraakmakend: number
  absurd: number
  lokaal: number
  total_score: number
  reden?: string
  insteek?: Insteek
  scored_at: string
}

export interface Insteek {
  opening: string
  invalshoeken: Array<{
    titel: string
    beschrijving: string
  }>
  vragen: Array<{
    vraag: string
    type: 'confronterend' | 'context' | 'publiek'
  }>
  sprekers: Array<{
    naam: string
    rol: string
    waarom: string
  }>
  shots: string[]
  formaat: {
    type: string
    lengte: string
    toon: string
    social_cut: string
  }
  urgentie: {
    niveau: 'hoog' | 'middel' | 'laag'
    toelichting: string
  }
}

export interface FeedItem extends NewsItem {
  brutaal?: number
  spraakmakend?: number
  absurd?: number
  lokaal?: number
  total_score?: number
  reden?: string
  insteek?: Insteek
  scored_at?: string
}

// ============================================================
// Client
// ============================================================

// Directe initialisatie — env vars zijn beschikbaar via next.config.mjs env block
const supabaseUrl = process.env.SUPABASE_URL ?? ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// ============================================================
// Queries
// ============================================================

export async function getActiveSources(): Promise<Source[]> {
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .eq('active', true)
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function upsertNewsItem(
  item: Omit<NewsItem, 'id' | 'created_at'>
): Promise<NewsItem | null> {
  const { data, error } = await supabase
    .from('news_items')
    .upsert(item, { onConflict: 'url', ignoreDuplicates: true })
    .select()
    .single()
  if (error && error.code !== '23505') throw error
  return data
}

export async function getUnscoredItems(limit = 100): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from('news_items')
    .select('*, dna_scores(id)')
    .is('dna_scores.id', null)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function upsertDnaScore(
  score: Omit<DnaScore, 'id' | 'scored_at'>
): Promise<DnaScore> {
  const { data, error } = await supabase
    .from('dna_scores')
    .upsert(score, { onConflict: 'news_item_id' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getFeedItems(opts: {
  platform?: string
  minScore?: number
  limit?: number
  offset?: number
} = {}): Promise<FeedItem[]> {
  const { platform, minScore = 0, limit = 50, offset = 0 } = opts
  let query = supabase
    .from('feed_items')
    .select('*')
    .range(offset, offset + limit - 1)

  if (minScore > 0) {
    query = query.gte('total_score', minScore)
  }

  if (platform && platform !== 'alles') {
    query = query.eq('platform', platform)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getItemById(id: string): Promise<FeedItem | null> {
  const { data, error } = await supabase
    .from('feed_items')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function updateInsteek(
  newsItemId: string,
  insteek: Insteek
): Promise<void> {
  const { error } = await supabase
    .from('dna_scores')
    .update({ insteek })
    .eq('news_item_id', newsItemId)
  if (error) throw error
}
