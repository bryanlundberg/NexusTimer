import { createHmac } from 'node:crypto'

export const TICKET_TTL_MS = 60_000

export type TicketSubject = { userId: string; name?: string; image?: string | null }

/**
 * Format `base64url({ sub, exp, name?, image? }).base64url(hmac-sha256)`, mirrored in
 * services/realtime/internal/auth/ticket.go. Empty name and image are left out.
 */
export function createTicket({ userId, name, image }: TicketSubject, secret: string, now = Date.now()) {
  const claims = { sub: userId, exp: now + TICKET_TTL_MS, ...(name && { name }), ...(image && { image }) }
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url')
  const signature = createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${signature}`
}
