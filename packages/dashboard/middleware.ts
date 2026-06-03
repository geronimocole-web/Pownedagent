import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createHmac } from 'crypto'

const COOKIE_NAME = 'powned_session'

function verifyToken(token: string): boolean {
  try {
    const secret = process.env.AUTH_SECRET ?? process.env.CRON_SECRET ?? 'powned-secret'
    const decoded = Buffer.from(token, 'base64url').toString()
    const parts = decoded.split(':')
    if (parts.length < 3) return false
    const username = parts[0]
    const timestamp = parts[1]
    const sig = parts[2]
    const payload = `${username}:${timestamp}`
    const expected = createHmac('sha256', secret).update(payload).digest('hex')
    return sig === expected
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Publieke paden — geen auth nodig
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/scrape') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Controleer sessie-cookie
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token || !verifyToken(token)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
