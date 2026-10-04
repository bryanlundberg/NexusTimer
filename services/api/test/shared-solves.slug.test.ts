import { isValidSlug, SHARED_SOLVE_SLUG_LENGTH } from '@nexustimer/contracts'
import { describe, expect, it } from 'vitest'
import { generateSlug } from '../src/modules/shared-solves/slug'

describe('shared solve slug', () => {
  it('generates base62 slugs of the expected length', () => {
    for (let i = 0; i < 500; i++) {
      const slug = generateSlug()
      expect(slug).toHaveLength(SHARED_SOLVE_SLUG_LENGTH)
      expect(isValidSlug(slug)).toBe(true)
    }
  })

  it('does not repeat across many generations', () => {
    const slugs = new Set(Array.from({ length: 5000 }, generateSlug))
    expect(slugs.size).toBe(5000)
  })

  it('rejects malformed slugs', () => {
    for (const value of ['', 'abc', 'abcdefghijk', 'abc-efghij', 'abc_efghij', '../etc/pas', 42, null, undefined]) {
      expect(isValidSlug(value)).toBe(false)
    }
  })
})
