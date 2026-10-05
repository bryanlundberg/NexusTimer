import { describe, expect, it } from 'vitest'
import { negotiateLocale, splitLocale } from '../src/locale'

const request = (headers: Record<string, string>) => new Request('https://beta.nexustimer.com/', { headers })

describe('negotiateLocale', () => {
  it('prefers the saved locale cookie', () => {
    expect(negotiateLocale(request({ cookie: 'theme=dark; NEXT_LOCALE=ja', 'accept-language': 'es' }))).toBe('ja')
  })

  it('ignores a cookie for a locale the site does not have', () => {
    expect(negotiateLocale(request({ cookie: 'NEXT_LOCALE=xx', 'accept-language': 'de' }))).toBe('de')
  })

  it('picks the best accepted language, falling back to its base language', () => {
    expect(negotiateLocale(request({ 'accept-language': 'nl;q=0.9, pt-BR;q=0.8, en;q=0.1' }))).toBe('pt')
    expect(negotiateLocale(request({ 'accept-language': 'zh-CN,zh;q=0.9' }))).toBe('zh')
    expect(negotiateLocale(request({ 'accept-language': 'fil-PH' }))).toBe('fil')
  })

  it('falls back to english', () => {
    expect(negotiateLocale(request({}))).toBe('en')
    expect(negotiateLocale(request({ 'accept-language': 'nl, *;q=0.5' }))).toBe('en')
  })
})

describe('splitLocale', () => {
  it('separates a known locale prefix from the path', () => {
    expect(splitLocale('/es/app')).toEqual({ locale: 'es', path: '/app' })
    expect(splitLocale('/es')).toEqual({ locale: 'es', path: '/' })
    expect(splitLocale('/espresso')).toEqual({ locale: null, path: '/espresso' })
  })
})
