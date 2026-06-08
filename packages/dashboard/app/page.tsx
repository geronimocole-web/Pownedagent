'use client'

import { useState, useEffect, useCallback } from 'react'
import { FeedItem } from '../components/FeedItem'
import { InsteekPanel } from '../components/InsteekPanel'
import type { FeedItem as FeedItemType } from '@powned/database'

const PLATFORMS = [
  { value: 'alles',   label: 'Alles' },
  { value: 'nieuws',  label: 'Nieuws' },
  { value: 'reddit',  label: 'Reddit' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'overig',  label: 'Overig' },
]

const STEEKWOORDEN = [
  'politie', 'gemeente', 'rechtbank', 'minister', 'fraude',
  'brand', 'ongeluk', 'overval', 'protest', 'Amsterdam',
  'Utrecht', 'Den Haag', 'student', 'woning', 'klimaat',
]

export default function HomePage() {
  const [items, setItems] = useState<FeedItemType[]>([])
  const [loading, setLoading] = useState(true)
  const [scraping, setScraping] = useState(false)
  const [isDemo, setIsDemo] = useState(false)
  const [platform, setPlatform] = useState('alles')
  const [minScore, setMinScore] = useState(0)
  const [activeItem, setActiveItem] = useState<FeedItemType | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [search, setSearch] = useState('')

  const loadItems = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        platform,
        minScore: String(minScore),
        limit: '100',
      })
      const res = await fetch(`/api/feed?${params}`)
      if (!res.ok) throw new Error('Feed ophalen mislukt')
      const data = await res.json()
      setItems(data.items)
      setIsDemo(!!data.demo)
      setLastUpdated(new Date())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [platform, minScore])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  async function handleScrape() {
    setScraping(true)
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        // Geen Authorization header nodig — sessie-cookie wordt automatisch meegestuurd
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Scrape mislukt')
      await loadItems()
      alert(`✓ Scrape klaar: ${data.saved} nieuwe items opgeslagen, ${data.scored} gescoord`)
    } catch (err) {
      alert('Fout: ' + (err as Error).message)
    } finally {
      setScraping(false)
    }
  }

  const heute = new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })

  const filteredItems = search.trim()
    ? items.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.source ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : items

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <header style={{
        background: 'var(--powned-panel)',
        borderBottom: '1px solid var(--powned-border)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: 'var(--powned-pink)',
            color: '#fff',
            fontWeight: 900,
            fontSize: 16,
            padding: '4px 8px',
            letterSpacing: '-0.05em',
          }}>
            POW
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1 }}>Redactie Agent</div>
            <div style={{ color: 'var(--powned-muted)', fontSize: 11 }}>{heute}</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: 'var(--powned-pink)' }}>
              {filteredItems.length}
            </div>
            <div style={{ color: 'var(--powned-muted)', fontSize: 10, textTransform: 'uppercase' }}>{search ? 'resultaten' : 'items'}</div>
          </div>
          {lastUpdated && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 12 }}>
                {lastUpdated.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ color: 'var(--powned-muted)', fontSize: 10, textTransform: 'uppercase' }}>bijgewerkt</div>
            </div>
          )}
          <button
            onClick={handleScrape}
            disabled={scraping}
            style={{
              background: scraping ? '#333' : 'var(--powned-pink)',
              color: '#fff',
              border: 'none',
              padding: '7px 14px',
              borderRadius: 4,
              cursor: scraping ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: 12,
              whiteSpace: 'nowrap',
            }}
          >
            {scraping ? '⏳ Bezig...' : '↻ Ververs'}
          </button>
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' })
              window.location.href = '/login'
            }}
            title="Uitloggen"
            style={{
              background: 'none',
              border: '1px solid var(--powned-border)',
              color: 'var(--powned-muted)',
              padding: '7px 10px',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            ⎋
          </button>
        </div>
      </header>

      {/* Demo banner */}
      {isDemo && (
        <div style={{
          background: '#1a0a00',
          borderBottom: '1px solid #ff9f00',
          padding: '6px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
        }}>
          <span style={{ color: '#ff9f00', fontSize: 11, fontWeight: 700 }}>⚡ DEMO MODUS</span>
          <span style={{ color: '#888', fontSize: 11 }}>Voorbeelddata — geen Supabase of Anthropic API vereist. Klik op een item en genereer een insteek om de AI in actie te zien.</span>
        </div>
      )}

      {/* Filterbalk */}
      <div style={{
        background: 'var(--powned-panel)',
        borderBottom: '1px solid var(--powned-border)',
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexShrink: 0,
        flexWrap: 'wrap',
      }}>
        {/* Platform filters */}
        <div style={{ display: 'flex', gap: 4 }}>
          {PLATFORMS.map(p => (
            <button
              key={p.value}
              onClick={() => setPlatform(p.value)}
              style={{
                background: platform === p.value ? 'var(--powned-pink)' : 'var(--powned-card)',
                color: platform === p.value ? '#fff' : 'var(--powned-muted)',
                border: '1px solid var(--powned-border)',
                padding: '4px 10px',
                borderRadius: 3,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: platform === p.value ? 600 : 400,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Zoekbalk */}
        <div style={{ position: 'relative', flex: '1 1 160px', maxWidth: 280 }}>
          <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--powned-muted)', fontSize: 13, pointerEvents: 'none' }}>🔍</span>
          <input
            type="text"
            placeholder="Zoek in titels en bronnen..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--powned-card)',
              border: '1px solid var(--powned-border)',
              borderRadius: 3,
              padding: '4px 8px 4px 28px',
              color: 'var(--powned-text)',
              fontSize: 12,
              outline: 'none',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--powned-muted)', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}
            >×</button>
          )}
        </div>

        {/* Score slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <span style={{ color: 'var(--powned-muted)', fontSize: 11 }}>Min. score:</span>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={minScore}
            onChange={e => setMinScore(Number(e.target.value))}
            style={{ width: 80, accentColor: 'var(--powned-pink)' }}
          />
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--powned-pink)', width: 24 }}>
            {minScore.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Steekwoorden */}
      <div style={{
        background: 'var(--powned-panel)',
        borderBottom: '1px solid var(--powned-border)',
        padding: '10px 20px',
        flexShrink: 0,
      }}>
        <div style={{ color: 'var(--powned-muted)', fontSize: 10, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.08em' }}>
          Snel zoeken
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {STEEKWOORDEN.map(woord => {
            const actief = search.toLowerCase() === woord.toLowerCase()
            const count = items.filter(item =>
              item.title.toLowerCase().includes(woord.toLowerCase()) ||
              (item.source ?? '').toLowerCase().includes(woord.toLowerCase())
            ).length
            return (
              <button
                key={woord}
                onClick={() => setSearch(actief ? '' : woord)}
                style={{
                  background: actief ? 'var(--powned-pink)' : 'var(--powned-card)',
                  color: actief ? '#fff' : 'var(--powned-text)',
                  border: `1px solid ${actief ? 'var(--powned-pink)' : 'var(--powned-border)'}`,
                  borderRadius: 6,
                  padding: '8px 14px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  minWidth: 90,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{woord}</div>
                <div style={{ fontSize: 10, color: actief ? 'rgba(255,255,255,0.7)' : 'var(--powned-muted)' }}>
                  {count} {count === 1 ? 'item' : 'items'}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Kolomheaders */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '32px 60px 1fr 160px 50px',
        gap: '12px',
        padding: '6px 16px',
        background: '#0d0d0d',
        borderBottom: '1px solid var(--powned-border)',
        flexShrink: 0,
      }}>
        <span style={{ color: 'var(--powned-muted)', fontSize: 10, textTransform: 'uppercase' }}>#</span>
        <span style={{ color: 'var(--powned-muted)', fontSize: 10, textTransform: 'uppercase' }}>Foto</span>
        <span style={{ color: 'var(--powned-muted)', fontSize: 10, textTransform: 'uppercase' }}>Titel / Bron</span>
        <span style={{ color: 'var(--powned-muted)', fontSize: 10, textTransform: 'uppercase' }}>DNA</span>
        <span style={{ color: 'var(--powned-muted)', fontSize: 10, textTransform: 'uppercase', textAlign: 'right' }}>Score</span>
      </div>

      {/* Feed */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--powned-muted)' }}>
            Laden...
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--powned-muted)', gap: 12 }}>
            <div style={{ fontSize: 32 }}>{search ? '🔍' : '📭'}</div>
            <div>{search ? `Geen resultaten voor "${search}"` : 'Geen items gevonden'}</div>
            {!search && (
              <button onClick={handleScrape} style={{ background: 'var(--powned-pink)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                Start eerste scrape
              </button>
            )}
          </div>
        ) : (
          filteredItems.map((item, i) => (
            <FeedItem
              key={item.id}
              item={item}
              rank={i + 1}
              isActive={activeItem?.id === item.id}
              onClick={() => setActiveItem(activeItem?.id === item.id ? null : item)}
            />
          ))
        )}
      </div>

      {/* Insteek panel */}
      <InsteekPanel
        item={activeItem}
        onClose={() => setActiveItem(null)}
      />
    </div>
  )
}
