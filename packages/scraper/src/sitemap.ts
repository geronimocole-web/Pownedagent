import fetch from 'node-fetch'
import { XMLParser } from 'fast-xml-parser'
import type { RssItem } from './rss'

const xmlParser = new XMLParser({ ignoreAttributes: false })

interface SitemapUrl {
  loc: string
  lastmod?: string
  'news:news'?: {
    'news:title'?: string
    'news:publication_date'?: string
  }
}

/** Haalt een sitemap op en filtert op items van de laatste 24 uur */
export async function fetchSitemap(sitemapUrl: string, sourceName: string): Promise<RssItem[]> {
  try {
    const response = await fetch(sitemapUrl, {
      headers: { 'User-Agent': 'PowNed-Redactie-Agent/1.0' },
      signal: AbortSignal.timeout(15_000),
    })

    if (!response.ok) {
      console.error(`[sitemap] HTTP ${response.status} voor ${sitemapUrl}`)
      return []
    }

    const xml = await response.text()
    const parsed = xmlParser.parse(xml)

    const urlset = parsed?.urlset?.url ?? []
    const urls: SitemapUrl[] = Array.isArray(urlset) ? urlset : [urlset]

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)

    return urls
      .filter(entry => {
        const dateStr = entry.lastmod ?? entry['news:news']?.['news:publication_date']
        if (!dateStr) return false
        return new Date(dateStr) > cutoff
      })
      .map(entry => {
        const newsTitle = entry['news:news']?.['news:title']
        const url = entry.loc
        return {
          title:       newsTitle ?? url.split('/').filter(Boolean).pop() ?? 'Onbekend',
          url,
          content:     '',
          publishedAt: entry.lastmod ?? entry['news:news']?.['news:publication_date'] ?? new Date().toISOString(),
          source:      sourceName,
          platform:    'nieuws' as const,
        }
      })
  } catch (err) {
    console.error(`[sitemap] Fout bij ${sitemapUrl}:`, (err as Error).message)
    return []
  }
}
