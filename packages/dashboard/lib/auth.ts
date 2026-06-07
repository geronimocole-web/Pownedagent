import { createHmac } from 'crypto'

const SECRET = process.env.AUTH_SECRET ?? process.env.CRON_SECRET ?? 'powned-secret'
export const COOKIE_NAME = 'powned_session'
export const MAX_AGE = 60 * 60 * 24 * 30 // 30 dagen

export function signToken(username: string): string {
  const payload = `${username}:${Date.now()}`
  const sig = createHmac('sha256', SECRET).update(payload).digest('hex')
  // base64url: geen padding (=), geen + of / → veilig in cookies zonder URL-encoding
  return Buffer.from(`${payload}:${sig}`).toString('base64url')
}

export function checkCredentials(username: string, password: string): boolean {
  const validUser = process.env.DASHBOARD_USERNAME ?? 'powned'
  const validPass = process.env.DASHBOARD_PASSWORD ?? 'redactie2025'
  return username === validUser && password === validPass
}
