import Parser from 'rss-parser'

export interface RssItem {
  title: string
  url: string
  content: string
  publishedAt: string
  source: string
  platform: 'nieuws' | 'reddit' | 'overig'
  image_url?: string
}

const parser = new Parser({
  timeout: 10_000,
  headers: {
    'User-Agent': 'PowNed-Redactie-Agent/1.0',
  },
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['description', 'description'],
      ['media:content', 'mediaContent', { keepArray: false }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: false }],
      ['enclosure', 'enclosure'],
    ],
  },
})

function detectPlatform(url: string): 'nieuws' | 'reddit' | 'overig' {
  if (url.includes('reddit.com')) return 'reddit'
  const newsDomains = [
    'nos.nl', 'rtlnieuws.nl', 'telegraaf.nl', 'ad.nl',
    'omroepgelderland.nl', 'rtvutrecht.nl', 'omroepbrabant.nl',
    'nu.nl', 'volkskrant.nl', 'parool.nl', 'trouw.nl',
  ]
  if (newsDomains.some(d => url.includes(d))) return 'nieuws'
  return 'overig'
}

function extractContent(item: any): string {
  const raw = item.contentEncoded ?? item.content ?? item.summary ?? item.description ?? ''
  return raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 1000)
}

function extractImage(item: any): string | undefined {
  // 1. media:content url attribuut
  if (item.mediaContent?.$.url) return item.mediaContent.$.url
  // 2. media:thumbnail
  if (item.mediaThumbnail?.$.url) return item.mediaThumbnail.$.url
  // 3. enclosure (podcasts/images)
  if (item.enclosure?.url && item.enclosure?.type?.startsWith('image')) return item.enclosure.url
  // 4. <img> tag in content
  const html = item.contentEncoded ?? item.content ?? item.description ?? ''
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (imgMatch) return imgMatch[1]
  return undefined
}

export async function fetchRSS(feedUrl: string, sourceName: string): Promise<RssItem[]> {
  try {
    const feed = await parser.parseURL(feedUrl)
    return feed.items
      .filter(item => item.title && (item.link || item.guid))
      .map(item => ({
        title:       item.title!.trim(),
        url:         (item.link ?? item.guid)!,
        content:     extractContent(item),
        publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
        source:      sourceName,
        platform:    detectPlatform(feedUrl),
        image_url:   extractImage(item),
      }))
  } catch (err) {
    console.error(`[rss] Fout bij ${feedUrl}:`, (err as Error).message)
    return []
  }
}
