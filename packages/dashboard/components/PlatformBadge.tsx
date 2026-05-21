interface PlatformBadgeProps {
  platform?: string
}

const PLATFORM_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  nieuws:  { bg: '#1a3a5c', color: '#4ea8de', label: 'Nieuws' },
  reddit:  { bg: '#2d1a0e', color: '#ff6b35', label: 'Reddit' },
  twitter: { bg: '#0d1f30', color: '#1da1f2', label: 'X/Twitter' },
  overig:  { bg: '#1a1a1a', color: '#888888', label: 'Overig' },
}

export function PlatformBadge({ platform = 'overig' }: PlatformBadgeProps) {
  const cfg = PLATFORM_COLORS[platform] ?? PLATFORM_COLORS.overig
  return (
    <span style={{
      background: cfg.bg,
      color: cfg.color,
      padding: '2px 6px',
      borderRadius: 3,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  )
}
