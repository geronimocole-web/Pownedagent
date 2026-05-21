import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PowNed Redactie Agent',
  description: 'AI-gestuurde nieuwsselectie voor de PowNed redactie',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  )
}
