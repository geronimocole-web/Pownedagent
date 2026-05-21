import { NextResponse } from 'next/server'

// Auth uitgeschakeld — dashboard is openbaar toegankelijk
export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
