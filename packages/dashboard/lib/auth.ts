import { createHmac } from 'crypto'

const SECRET = process.env.AUTH_SECRET ?? process.env.CRON_SECRET ?? 'powned-secret'
const COOKIE_NAME = 'powned_session'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 dagen

export function signToken(username: string): string {
  const payload = `${username}:${Date.now()}`
  const sig = createHmac('sha256', SECRET).update(payload).digest('hex')
  return Buffer.from(`${payload}:${sig}`).toString('base64url')
}

export function verifyToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const parts = decoded.split(':')
    if (parts.length < 3) return null
    const username = parts[0]
    const timestamp = parts[1]
    const sig = parts[2]
    const payload = `${username}:${timestamp}`
    const expected = createHmac('sha256', SECRET).update(payload).digest('hex')
    if (sig !== expected) return null
    return username
  } catch {
    return null
  }
}

export function checkCredentials(username: string, password: string): boolean {
  const validUser = process.env.DASHBOARD_USERNAME ?? 'powned'
  const validPass = process.env.DASHBOARD_PASSWORD ?? 'redactie2025'
  return username === validUser && password === validPass
}

export { COOKIE_NAME, MAX_AGE }
