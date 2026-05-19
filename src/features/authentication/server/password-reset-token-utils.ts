import { randomBytes } from 'crypto'

export const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000

export function generateOobCode(): string {
  return randomBytes(32).toString('hex')
}

export function getPasswordResetExpiry(): Date {
  return new Date(Date.now() + PASSWORD_RESET_TTL_MS)
}
