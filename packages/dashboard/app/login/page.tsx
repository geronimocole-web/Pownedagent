'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Inloggen mislukt')
        return
      }

      window.location.href = '/'
    } catch {
      setError('Verbindingsfout, probeer opnieuw')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--powned-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 380,
        padding: '0 20px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 8,
          }}>
            <div style={{
              background: 'var(--powned-pink)',
              color: '#fff',
              fontWeight: 900,
              fontSize: 24,
              padding: '6px 12px',
              letterSpacing: '-0.05em',
            }}>
              POW
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--powned-text)' }}>Redactie Agent</div>
              <div style={{ fontSize: 11, color: 'var(--powned-muted)' }}>Redactie portaal</div>
            </div>
          </div>
        </div>

        {/* Formulier */}
        <div style={{
          background: 'var(--powned-panel)',
          border: '1px solid var(--powned-border)',
          borderRadius: 8,
          padding: 32,
        }}>
          <h1 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, color: 'var(--powned-text)' }}>
            Inloggen
          </h1>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--powned-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Gebruikersnaam
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
                autoComplete="username"
                style={{
                  width: '100%',
                  background: 'var(--powned-card)',
                  border: '1px solid var(--powned-border)',
                  borderRadius: 4,
                  padding: '10px 12px',
                  color: 'var(--powned-text)',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--powned-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Wachtwoord
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{
                  width: '100%',
                  background: 'var(--powned-card)',
                  border: '1px solid var(--powned-border)',
                  borderRadius: 4,
                  padding: '10px 12px',
                  color: 'var(--powned-text)',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <div style={{
                background: '#2a0a0a',
                border: '1px solid #ff4444',
                borderRadius: 4,
                padding: '8px 12px',
                color: '#ff4444',
                fontSize: 12,
                marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#555' : 'var(--powned-pink)',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                padding: '11px',
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Bezig...' : 'Inloggen'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'var(--powned-muted)' }}>
          Alleen voor PowNed redactiemedewerkers
        </p>
      </div>
    </div>
  )
}
