'use client'

interface ScoreBarsProps {
  brutaal?: number
  spraakmakend?: number
  absurd?: number
  lokaal?: number
  compact?: boolean
}

interface BarProps {
  label: string
  value: number
  color: string
  compact: boolean
}

function Bar({ label, value, color, compact }: BarProps) {
  const safeValue = value ?? 0
  const pct = Math.round((safeValue / 10) * 100)
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 min-w-0">
        <span style={{ color: 'var(--powned-muted)', fontSize: '10px', width: 14, flexShrink: 0 }}>
          {label[0].toUpperCase()}
        </span>
        <div style={{ flex: 1, background: 'var(--powned-border)', borderRadius: 2, height: 4, minWidth: 40 }}>
          <div
            className="score-bar-fill"
            style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: 2 }}
          />
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--powned-muted)', width: 24, textAlign: 'right', flexShrink: 0 }}>
          {safeValue.toFixed(1)}
        </span>
      </div>
    )
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ color: 'var(--powned-muted)', fontSize: 12 }}>{label}</span>
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: color }}>{safeValue.toFixed(1)}</span>
      </div>
      <div style={{ background: 'var(--powned-border)', borderRadius: 3, height: 6 }}>
        <div
          className="score-bar-fill"
          style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: 3 }}
        />
      </div>
    </div>
  )
}

export function ScoreBars({ brutaal = 0, spraakmakend = 0, absurd = 0, lokaal = 0, compact = false }: ScoreBarsProps) {
  const bars = [
    { label: 'Brutaal',      value: brutaal,      color: '#ff4444' },
    { label: 'Spraakmakend', value: spraakmakend, color: '#e6007e' },
    { label: 'Absurd',       value: absurd,       color: '#ff9f00' },
    { label: 'Lokaal',       value: lokaal,       color: '#44bb88' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 3 : 8 }}>
      {bars.map(b => (
        <Bar key={b.label} compact={compact} {...b} />
      ))}
    </div>
  )
}
