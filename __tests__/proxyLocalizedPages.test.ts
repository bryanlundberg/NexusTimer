// @vitest-environment node
import { NextRequest } from 'next/server'
import { proxy } from '@/proxy'
import { LOCALE_COOKIE, LOCALE_HEADER } from '@/shared/config/i18n/locales'

const request = (path: string, cookie?: string) =>
  new NextRequest(`https://nexustimer.com${path}`, {
    headers: cookie ? { cookie: `${LOCALE_COOKIE}=${cookie}` } : {}
  })

describe('proxy localized public pages', () => {
  it('rewrites /es to the root page with the locale header', () => {
    const response = proxy(request('/es'))

    expect(response.headers.get('x-middleware-rewrite')).toBe('https://nexustimer.com/')
    expect(response.headers.get(`x-middleware-request-${LOCALE_HEADER}`)).toBe('es')
    expect(response.cookies.get(LOCALE_COOKIE)?.value).toBe('es')
  })

  it('keeps an existing locale cookie on a localized landing', () => {
    const response = proxy(request('/es', 'fr'))

    expect(response.headers.get(`x-middleware-request-${LOCALE_HEADER}`)).toBe('es')
    expect(response.cookies.get(LOCALE_COOKIE)).toBeUndefined()
  })

  it('redirects /en to the root', () => {
    const response = proxy(request('/en'))

    expect(response.status).toBe(308)
    expect(response.headers.get('location')).toBe('https://nexustimer.com/')
  })

  it('rewrites localized algorithm pages keeping the query', () => {
    const response = proxy(request('/ja/algorithms/oll?view=grid'))

    expect(response.headers.get('x-middleware-rewrite')).toBe('https://nexustimer.com/algorithms/oll?view=grid')
    expect(response.headers.get(`x-middleware-request-${LOCALE_HEADER}`)).toBe('ja')
  })

  it('redirects /en/algorithms to the unprefixed url', () => {
    const response = proxy(request('/en/algorithms/'))

    expect(response.status).toBe(308)
    expect(response.headers.get('location')).toBe('https://nexustimer.com/algorithms')
  })

  it('leaves app paths under a locale prefix alone', () => {
    const response = proxy(request('/es/app', 'es'))

    expect(response.headers.get('x-middleware-rewrite')).toBeNull()
    expect(response.headers.get(`x-middleware-request-${LOCALE_HEADER}`)).toBeNull()
  })
})
