import { createHmac, timingSafeEqual } from 'node:crypto'

export const TICKET_TTL_MS = 60_000

const sign = (payload: string, secret: string) => createHmac('sha256', secret).update(payload).digest('base64url')

/** Format `base64url({ sub, exp }).base64url(hmac-sha256)`, mirrored in services/realtime/internal/auth/ticket.go. */
export function createTicket(userId: string, secret: string, now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ sub: userId, exp: now + TICKET_TTL_MS })).toString('base64url')
  return `${payload}.${sign(payload, secret)}`
}

export function verifyTicket(ticket: string | null | undefined, secret: string, now = Date.now()): string | null {
  const [payload, signature] = ticket?.split('.') ?? []
  if (!payload || !signature) return null

  const expected = Buffer.from(sign(payload, secret), 'base64url')
  const given = Buffer.from(signature, 'base64url')
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null

  try {
    const { sub, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (typeof sub !== 'string' || typeof exp !== 'number' || exp < now) return null
    return sub
  } catch {
    return null
  }
}
