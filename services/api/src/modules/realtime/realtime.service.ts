import { createHmac } from 'node:crypto'

export const TICKET_TTL_MS = 60_000

/** Format `base64url({ sub, exp }).base64url(hmac-sha256)`, mirrored in services/realtime/internal/auth/ticket.go. */
export function createTicket(userId: string, secret: string, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ sub: userId, exp: now + TICKET_TTL_MS })).toString('base64url')
  const signature = createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${signature}`
}
