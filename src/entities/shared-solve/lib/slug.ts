import { randomBytes } from 'crypto'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const UNBIASED_LIMIT = 256 - (256 % ALPHABET.length)

export const SLUG_LENGTH = 10
export const SLUG_PATTERN = /^[A-Za-z0-9]{10}$/

export function isValidSlug(value: unknown): value is string {
  return typeof value === 'string' && SLUG_PATTERN.test(value)
}

export function generateSlug(): string {
  let slug = ''
  while (slug.length < SLUG_LENGTH) {
    for (const byte of randomBytes(SLUG_LENGTH * 2)) {
      if (byte >= UNBIASED_LIMIT) continue
      slug += ALPHABET[byte % ALPHABET.length]
      if (slug.length === SLUG_LENGTH) break
    }
  }
  return slug
}
