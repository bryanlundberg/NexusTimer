// @vitest-environment node
import { NextRequest } from 'next/server'
import proxy from '@/proxy'
import { LOCALE_COOKIE } from '@/shared/config/i18n/locales'

const request = (path: string, headers: Record<string, string> = {}) =>
  new NextRequest(`https://nexustimer.com${path}`, { headers })

const rewriteOf = (response: Response) => response.headers.get('x-middleware-rewrite')

describe('locale proxy', () => {
  it('serves unprefixed urls as english without redirecting', () => {
    const response = proxy(request('/algorithms/oll'))

    expect(response.status).toBe(200)
    expect(rewriteOf(response)).toBe('https://nexustimer.com/en/algorithms/oll')
  })

  it('serves prefixed urls in their locale', () => {
    const response = proxy(request('/es/app?tab=stats'))

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
    expect(response.headers.get('x-middleware-request-x-next-intl-locale')).toBe('es')
  })

  it('redirects the english prefix to the unprefixed url', () => {
    const response = proxy(request('/en/algorithms'))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://nexustimer.com/algorithms')
  })

  it('never redirects a cookieless client back to the same url', () => {
    const response = proxy(request('/algorithms/oll', { 'accept-language': 'es-ES' }))
    const location = response.headers.get('location')

    expect(location).toBe('https://nexustimer.com/es/algorithms/oll')
    expect(proxy(request('/es/algorithms/oll', { 'accept-language': 'es-ES' })).headers.get('location')).toBeNull()
  })

  it('follows the stored locale cookie', () => {
    const response = proxy(request('/app', { cookie: `${LOCALE_COOKIE}=ja` }))

    expect(response.headers.get('location')).toBe('https://nexustimer.com/ja/app')
  })
})
