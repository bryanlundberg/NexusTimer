import crypto from 'crypto'

/**
 * Used by rooms cookie-based auth to bind the `rooms_auth` cookie to a specific roomId.
 */
export function signRoomId(roomId: string): string {
  return crypto
    .createHmac('sha256', process.env.NEXTAUTH_SECRET || '')
    .update(roomId)
    .digest('hex')
}
