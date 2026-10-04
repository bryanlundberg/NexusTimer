import { randomBytes } from 'node:crypto'
import { SHARED_SOLVE_SLUG_LENGTH } from '@nexustimer/contracts'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const UNBIASED_LIMIT = 256 - (256 % ALPHABET.length)

export function generateSlug(): string {
  let slug = ''
  while (slug.length < SHARED_SOLVE_SLUG_LENGTH) {
    for (const byte of randomBytes(SHARED_SOLVE_SLUG_LENGTH * 2)) {
      if (byte >= UNBIASED_LIMIT) continue
      slug += ALPHABET[byte % ALPHABET.length]
      if (slug.length === SHARED_SOLVE_SLUG_LENGTH) break
    }
  }
  return slug
}
