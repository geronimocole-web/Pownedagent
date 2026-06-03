import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkCredentials, signToken, COOKIE_NAME, MAX_AGE } from '../../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!checkCredentials(username, password)) {
      return NextResponse.json({ error: 'Onjuiste gebruikersnaam of wachtwoord' }, { status: 401 })
    }

    const token = signToken(username)
    const response = NextResponse.json({ success: true })

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: MAX_AGE,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek' }, { status: 400 })
  }
}
