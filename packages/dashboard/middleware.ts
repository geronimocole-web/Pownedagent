import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'powned_session'

async function verifyToken(rawToken: string): Promise<boolean> {
  try {
    const secret = process.env.AUTH_SECRET ?? process.env.CRON_SECRET ?? 'powned-secret'

    // URL-decode indien browser cookie heeft URL-encoded (bijv. %3D%3D → ==)
    const token = decodeURIComponent(rawToken)

    // base64url of base64 → string (herstel padding + vervang URL-safe tekens)
    const padded = token + '=='.slice(0, (4 - token.length % 4) % 4)
    const decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'))
    const lastColon = decoded.lastIndexOf(':')
    if (lastColon === -1) return false
    const payload = decoded.slice(0, lastColon)
    const sig = decoded.slice(lastColon + 1)

    // Web Crypto API (werkt in Edge runtime)
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw', enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false, ['sign']
    )
    const sigBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
    const expected = Array.from(new Uint8Array(sigBuffer))
      .map(b => b.toString(16).padStart(2, '0')).join('')

    return sig === expected
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Publieke paden — geen auth check
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/') ||   // alle API routes gaan via server, cookie wordt meegestuurd
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token || !(await verifyToken(token))) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
