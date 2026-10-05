import { describe, expect, it } from 'vitest'
import { splitLocale } from '../src/locale'

describe('splitLocale', () => {
  it('separates a known locale prefix from the path', () => {
    expect(splitLocale('/es/app')).toEqual({ locale: 'es', path: '/app' })
    expect(splitLocale('/es')).toEqual({ locale: 'es', path: '/' })
    expect(splitLocale('/espresso')).toEqual({ locale: null, path: '/espresso' })
  })
})
