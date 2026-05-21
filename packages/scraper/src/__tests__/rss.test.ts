import { describe, it, expect, vi } from 'vitest'
import { fetchRSS } from '../rss.js'

// Mock rss-parser
vi.mock('rss-parser', () => {
  const mockItems = [
    {
      title: 'Test artikel 1',
      link: 'https://nos.nl/artikel/1',
      isoDate: '2025-01-01T10:00:00.000Z',
      content: '<p>Dit is de inhoud van het artikel</p>',
    },
    {
      title: 'Test artikel 2',
      link: 'https://nos.nl/artikel/2',
      isoDate: '2025-01-01T11:00:00.000Z',
      content: 'Tweede artikel zonder HTML',
    },
    {
      // Item zonder title — moet gefilterd worden
      link: 'https://nos.nl/artikel/3',
    },
  ]

  return {
    default: class Parser {
      async parseURL(_url: string) {
        return { items: mockItems }
      }
    },
  }
})

describe('fetchRSS', () => {
  it('geeft genormaliseerde items terug', async () => {
    const items = await fetchRSS('https://feeds.nos.nl/nosnieuwsalgemeen', 'NOS')
    expect(items).toHaveLength(2) // item zonder title gefilterd
    expect(items[0].title).toBe('Test artikel 1')
    expect(items[0].url).toBe('https://nos.nl/artikel/1')
    expect(items[0].source).toBe('NOS')
    expect(items[0].platform).toBe('nieuws')
  })

  it('strip HTML tags uit content', async () => {
    const items = await fetchRSS('https://feeds.nos.nl/nosnieuwsalgemeen', 'NOS')
    expect(items[0].content).not.toContain('<p>')
    expect(items[0].content).toContain('Dit is de inhoud')
  })

  it('herkent Reddit platform', async () => {
    const items = await fetchRSS('https://www.reddit.com/r/netherlands/new/.rss', 'Reddit')
    expect(items[0].platform).toBe('reddit')
  })

  it('geeft lege array bij fout', async () => {
    vi.resetAllMocks()
    vi.mock('rss-parser', () => {
      return {
        default: class Parser {
          async parseURL() {
            throw new Error('Network error')
          }
        },
      }
    })
    // fetchRSS logt de fout maar crasht niet
    const items = await fetchRSS('https://kapot.nl/feed', 'Kapot')
    expect(Array.isArray(items)).toBe(true)
  })
})

describe('URL deduplicatie', () => {
  it('produceert unieke URLs per aanroep', async () => {
    const items = await fetchRSS('https://feeds.nos.nl/nosnieuwsalgemeen', 'NOS')
    const urls = items.map(i => i.url)
    const unique = new Set(urls)
    expect(urls.length).toBe(unique.size)
  })
})
