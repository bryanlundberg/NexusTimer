export const VERIFICATION_CODE_LENGTH = 6
export const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function getVerificationExpiry(): Date {
  return new Date(Date.now() + VERIFICATION_CODE_TTL_MS)
}
