'use client'

import { useState } from 'react'
import { ScoreBars } from './ScoreBars'
import type { FeedItem, Insteek } from '@powned/database'

interface InsteekPanelProps {
  item: FeedItem | null
  onClose: () => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ color: 'var(--powned-pink)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, borderBottom: '1px solid var(--powned-border)', paddingBottom: 6 }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function UrgentieBadge({ niveau }: { niveau: string }) {
  const colors = { hoog: '#ff4444', middel: '#ff9f00', laag: '#44bb88' }
  const color = colors[niveau as keyof typeof colors] ?? '#888'
  return (
    <span style={{ background: color + '22', color, padding: '2px 8px', borderRadius: 3, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
      {niveau}
    </span>
  )
}

export function InsteekPanel({ item, onClose }: InsteekPanelProps) {
  const [generating, setGenerating] = useState(false)
  const [insteek, setInsteek] = useState<Insteek | null>(item?.insteek ?? null)
  const [copied, setCopied] = useState(false)

  const isOpen = item !== null

  async function handleGenereer() {
    if (!item) return
    setGenerating(true)
    try {
      const res = await fetch(`/api/insteek/${item.id}`, { method: 'POST' })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setInsteek(data.insteek)
    } catch (err) {
      alert('Fout bij genereren: ' + (err as Error).message)
    } finally {
      setGenerating(false)
    }
  }

  function handleKopieer() {
    if (!item || !insteek) return
    const text = [
      `# ${item.title}`,
      `Bron: ${item.source} | Score: ${item.total_score?.toFixed(1) ?? '—'}`,
      '',
      `## Opening`,
      insteek.opening,
      '',
      `## Invalshoeken`,
      ...insteek.invalshoeken.map((i, n) => `${n + 1}. **${i.titel}**\n   ${i.beschrijving}`),
      '',
      `## Vragen`,
      ...insteek.vragen.map(v => `- [${v.type}] ${v.vraag}`),
      '',
      `## Sprekers`,
      ...insteek.sprekers.map(s => `- ${s.naam} (${s.rol}) — ${s.waarom}`),
      '',
      `## Shots`,
      ...insteek.shots.map(s => `- ${s}`),
      '',
      `## Formaat`,
      `Type: ${insteek.formaat.type} | Lengte: ${insteek.formaat.lengte} | Toon: ${insteek.formaat.toon}`,
      `Social cut: ${insteek.formaat.social_cut}`,
      '',
      `## Urgentie: ${insteek.urgentie.niveau.toUpperCase()}`,
      insteek.urgentie.toelichting,
    ].join('\n')

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}

      {/* Panel */}
      <div
        className={`insteek-panel ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 520,
          maxWidth: '95vw',
          background: 'var(--powned-panel)',
          borderLeft: '1px solid var(--powned-border)',
          zIndex: 50,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {item && (
          <>
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--powned-border)', position: 'sticky', top: 0, background: 'var(--powned-panel)', zIndex: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, flex: 1 }}>{item.title}</h2>
                <button
                  onClick={onClose}
                  style={{ color: 'var(--powned-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, lineHeight: 1, flexShrink: 0 }}
                >
                  ×
                </button>
              </div>
              <div style={{ marginTop: 10 }}>
                <ScoreBars brutaal={item.brutaal} spraakmakend={item.spraakmakend} absurd={item.absurd} lokaal={item.lokaal} />
              </div>
              {item.reden && (
                <p style={{ marginTop: 10, color: 'var(--powned-muted)', fontSize: 12, fontStyle: 'italic' }}>
                  {item.reden}
                </p>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: 20, flex: 1 }}>
              {insteek ? (
                <>
                  <Section title="Opening / haak">
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--powned-text)' }}>{insteek.opening}</p>
                  </Section>

                  <Section title="Invalshoeken">
                    {insteek.invalshoeken.map((inv, i) => (
                      <div key={i} style={{ marginBottom: 12, padding: 10, background: 'var(--powned-card)', borderRadius: 4, borderLeft: '2px solid var(--powned-pink)' }}>
                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: 'var(--powned-pink)' }}>{inv.titel}</div>
                        <div style={{ fontSize: 12, color: 'var(--powned-text)', lineHeight: 1.5 }}>{inv.beschrijving}</div>
                      </div>
                    ))}
                  </Section>

                  <Section title="Vragen">
                    {insteek.vragen.map((v, i) => {
                      const typeColors = { confronterend: '#ff4444', context: '#4ea8de', publiek: '#44bb88' }
                      const tc = typeColors[v.type] ?? '#888'
                      return (
                        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                          <span style={{ color: tc, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', marginTop: 2, flexShrink: 0 }}>[{v.type}]</span>
                          <span style={{ fontSize: 13, lineHeight: 1.5 }}>{v.vraag}</span>
                        </div>
                      )
                    })}
                  </Section>

                  <Section title="Sprekers">
                    {insteek.sprekers.map((s, i) => (
                      <div key={i} style={{ marginBottom: 10 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{s.naam}</div>
                        <div style={{ color: 'var(--powned-muted)', fontSize: 11 }}>{s.rol}</div>
                        <div style={{ fontSize: 12, color: 'var(--powned-text)', marginTop: 2 }}>{s.waarom}</div>
                      </div>
                    ))}
                  </Section>

                  <Section title="Must-have shots">
                    <ul style={{ paddingLeft: 16 }}>
                      {insteek.shots.map((s, i) => (
                        <li key={i} style={{ fontSize: 12, marginBottom: 4, color: 'var(--powned-text)' }}>{s}</li>
                      ))}
                    </ul>
                  </Section>

                  <Section title="Formaat">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {[
                        ['Type', insteek.formaat.type],
                        ['Lengte', insteek.formaat.lengte],
                        ['Toon', insteek.formaat.toon],
                      ].map(([k, v]) => (
                        <div key={k} style={{ background: 'var(--powned-card)', padding: 8, borderRadius: 4 }}>
                          <div style={{ color: 'var(--powned-muted)', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                          <div style={{ fontSize: 12 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 8, padding: 8, background: 'var(--powned-card)', borderRadius: 4 }}>
                      <div style={{ color: 'var(--powned-muted)', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Social cut (30s)</div>
                      <div style={{ fontSize: 12 }}>{insteek.formaat.social_cut}</div>
                    </div>
                  </Section>

                  <Section title="Urgentie">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <UrgentieBadge niveau={insteek.urgentie.niveau} />
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--powned-text)', lineHeight: 1.5 }}>{insteek.urgentie.toelichting}</p>
                  </Section>
                </>
              ) : (
                <div style={{ textAlign: 'center', paddingTop: 40 }}>
                  <p style={{ color: 'var(--powned-muted)', marginBottom: 20, fontSize: 13 }}>
                    Nog geen insteek gegenereerd voor dit item.
                  </p>
                  <button
                    onClick={handleGenereer}
                    disabled={generating}
                    style={{
                      background: generating ? '#333' : 'var(--powned-pink)',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: 4,
                      cursor: generating ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {generating ? '⏳ Genereren...' : '✨ Genereer insteek'}
                  </button>
                </div>
              )}
            </div>

            {/* Footer acties */}
            {insteek && (
              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--powned-border)', display: 'flex', gap: 8 }}>
                <button
                  onClick={handleKopieer}
                  style={{ flex: 1, background: copied ? '#1a3a1a' : 'var(--powned-card)', color: copied ? '#44bb88' : 'var(--powned-text)', border: '1px solid var(--powned-border)', padding: '8px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}
                >
                  {copied ? '✓ Gekopieerd!' : '📋 Kopieer alles'}
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ flex: 1, background: 'var(--powned-card)', color: 'var(--powned-text)', border: '1px solid var(--powned-border)', padding: '8px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 500, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                >
                  🔗 Origineel artikel
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
