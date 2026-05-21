import 'dotenv/config'
import { getActiveSources, upsertNewsItem } from '@powned/database'
import { fetchRSS } from './rss'
import { fetchSitemap } from './sitemap'
import type { RssItem } from './rss'

/** Verwijder dubbele URLs uit een array van items */
function deduplicateByUrl(items: RssItem[]): RssItem[] {
  const seen = new Set<string>()
  return items.filter(item => {
    if (seen.has(item.url)) return false
    seen.add(item.url)
    return true
  })
}

/** Hoofdfunctie: scrapet alle actieve bronnen en slaat nieuwe items op */
export async function runScraper(): Promise<{ found: number; saved: number }> {
  console.log(`[scraper] Start — ${new Date().toLocaleString('nl-NL')}`)

  const sources = await getActiveSources()
  console.log(`[scraper] ${sources.length} actieve bronnen gevonden`)

  const allItems: RssItem[] = []

  // Haal alle feeds parallel op (max 5 tegelijk)
  const CONCURRENCY = 5
  for (let i = 0; i < sources.length; i += CONCURRENCY) {
    const batch = sources.slice(i, i + CONCURRENCY)
    const results = await Promise.allSettled(
      batch.map(source => {
        if (source.type === 'sitemap') {
          return fetchSitemap(source.url, source.name)
        }
        return fetchRSS(source.url, source.name)
      })
    )

    for (const result of results) {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value)
      }
    }
  }

  const unique = deduplicateByUrl(allItems)
  console.log(`[scraper] ${allItems.length} items gevonden, ${unique.length} unieke`)

  let saved = 0
  for (const item of unique) {
    try {
      const result = await upsertNewsItem({
        title:        item.title,
        url:          item.url,
        source:       item.source,
        platform:     item.platform,
        published_at: item.publishedAt,
        raw_content:  item.content,
        image_url:    item.image_url,
      })
      if (result) saved++
    } catch (err) {
      console.error(`[scraper] Fout bij opslaan ${item.url}:`, (err as Error).message)
    }
  }

  console.log(`[scraper] Klaar — ${saved} nieuwe items opgeslagen`)
  return { found: unique.length, saved }
}

/** Handmatige trigger (bijv. vanuit API route) */
export const scrapeOnDemand = runScraper
