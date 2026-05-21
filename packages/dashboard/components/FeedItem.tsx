'use client'

import { ScoreBars } from './ScoreBars'
import { PlatformBadge } from './PlatformBadge'
import type { FeedItem as FeedItemType } from '@powned/database'

interface FeedItemProps {
  item: FeedItemType
  rank: number
  isActive: boolean
  onClick: () => void
}

function ScorePill({ score }: { score?: number }) {
  if (score == null) return <span style={{ color: 'var(--powned-muted)', fontFamily: 'monospace', fontSize: 13 }}>—</span>
  const color = score >= 7 ? '#e6007e' : score >= 5 ? '#ff9f00' : '#888'
  return (
    <span style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color, minWidth: 36, textAlign: 'right', display: 'block' }}>
      {score.toFixed(1)}
    </span>
  )
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (h > 24) return `${Math.floor(h / 24)}d`
  if (h > 0) return `${h}u`
  return `${m}m`
}

function Thumbnail({ url, imageUrl, title }: { url: string; imageUrl?: string; title: string }) {
  const domain = (() => { try { return new URL(url).hostname } catch { return '' } })()

  return (
    <div style={{ width: 56, height: 56, borderRadius: 4, overflow: 'hidden', flexShrink: 0, background: '#1a1a1a', border: '1px solid var(--powned-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {imageUrl ? (
        <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => {
            const el = e.currentTarget
            el.style.display = 'none'
            const parent = el.parentElement!
            parent.innerHTML = `<img src="https://www.google.com/s2/favicons?domain=${domain}&sz=32" style="width:24px;height:24px;opacity:0.5" />`
          }}
        />
      ) : domain ? (
        <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} alt="" style={{ width: 24, height: 24, opacity: 0.5 }} />
      ) : (
        <span style={{ fontSize: 20 }}>📰</span>
      )}
    </div>
  )
}

export function FeedItem({ item, rank, isActive, onClick }: FeedItemProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '32px 60px 1fr 160px 50px',
        gap: '12px',
        alignItems: 'center',
        padding: '10px 16px',
        background: isActive ? '#1e0a14' : 'var(--powned-card)',
        borderLeft: isActive ? '3px solid var(--powned-pink)' : '3px solid transparent',
        borderBottom: '1px solid var(--powned-border)',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#141414' }}
      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--powned-card)' }}
    >
      {/* Rang */}
      <span style={{ color: 'var(--powned-muted)', fontFamily: 'monospace', fontSize: 11, textAlign: 'right', cursor: 'default' }}>
        #{rank}
      </span>

      {/* Thumbnail — klik opent insteek panel */}
      <div onClick={onClick} style={{ cursor: 'pointer' }}>
        <Thumbnail url={item.url} imageUrl={(item as any).image_url} title={item.title} />
      </div>

      {/* Titel + meta */}
      <div style={{ minWidth: 0 }}>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.4, marginBottom: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: 'var(--powned-text)', textDecoration: 'none' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--powned-pink)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--powned-text)' }}
        >
          {item.title}
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
          <PlatformBadge platform={item.platform} />
          <span style={{ color: 'var(--powned-muted)', fontSize: 11 }}>{item.source}</span>
          <span style={{ color: 'var(--powned-muted)', fontSize: 11 }}>{timeAgo(item.published_at ?? item.created_at)}</span>
          {item.reden && (
            <span style={{ color: '#666', fontSize: 11, fontStyle: 'italic', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: 250 }}>
              {item.reden}
            </span>
          )}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--powned-muted)', fontSize: 10, textDecoration: 'none', border: '1px solid var(--powned-border)', padding: '1px 6px', borderRadius: 3, whiteSpace: 'nowrap' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--powned-pink)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--powned-pink)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--powned-muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--powned-border)' }}
          >
            ↗ artikel
          </a>
        </div>
      </div>

      {/* Score bars — klik opent insteek panel */}
      <div onClick={onClick} style={{ cursor: 'pointer' }}>
        <ScoreBars brutaal={item.brutaal} spraakmakend={item.spraakmakend} absurd={item.absurd} lokaal={item.lokaal} compact />
      </div>

      {/* Score pill — klik opent insteek panel */}
      <div onClick={onClick} style={{ cursor: 'pointer' }}>
        <ScorePill score={item.total_score} />
      </div>
    </div>
  )
}
