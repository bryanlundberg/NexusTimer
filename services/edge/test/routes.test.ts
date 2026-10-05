import { DYNAMIC_PAGE_ROUTES } from '@nexustimer/contracts'
import { describe, expect, it } from 'vitest'
import wranglerConfig from '../wrangler.jsonc?raw'
import { isApiPath, resolvePage, SIGNED_IN_PAGES, SIGNED_OUT_PAGES } from '../src/routes'

describe('isApiPath', () => {
  it('matches the api root and everything below it', () => {
    expect(isApiPath('/api')).toBe(true)
    expect(isApiPath('/api/health/ready')).toBe(true)
    expect(isApiPath('/api/auth/get-session')).toBe(true)
    expect(isApiPath('/api/v1/chats')).toBe(true)
  })

  it('does not match on a partial segment', () => {
    expect(isApiPath('/apis')).toBe(false)
    expect(isApiPath('/api-docs')).toBe(false)
  })

  it('leaves pages alone', () => {
    expect(isApiPath('/')).toBe(false)
    expect(isApiPath('/es/app')).toBe(false)
  })
})

describe('resolvePage', () => {
  it('serves pages without a route of their own as they are', () => {
    expect(resolvePage('/')).toEqual({ kind: 'asset' })
    expect(resolvePage('/es')).toEqual({ kind: 'asset' })
    expect(resolvePage('/app')).toEqual({ kind: 'asset' })
    expect(resolvePage('/en/app')).toEqual({ kind: 'asset' })
  })

  it('maps a dynamic page, its payload and its segment files to the prerendered shell', () => {
    expect(resolvePage('/people/64b7f0c2a1b2c3d4e5f60718')).toEqual({
      kind: 'dynamic',
      base: '/people',
      id: '64b7f0c2a1b2c3d4e5f60718',
      assetPath: '/people/_',
      isDocument: true
    })
    expect(resolvePage('/s/AbCdEf1234.txt')).toMatchObject({
      id: 'AbCdEf1234',
      assetPath: '/s/_.txt',
      isDocument: false
    })
    expect(resolvePage('/free-play/123456/__next._tree.txt')).toMatchObject({
      id: '123456',
      assetPath: '/free-play/_/__next._tree.txt',
      isDocument: false
    })
  })

  it('keeps the locale prefix of the url', () => {
    expect(resolvePage('/es/s/AbCdEf1234')).toMatchObject({ assetPath: '/es/s/_', isDocument: true })
    expect(resolvePage('/fil/people/abc.txt')).toMatchObject({ assetPath: '/fil/people/_.txt' })
    expect(resolvePage('/en/people/abc')).toMatchObject({ assetPath: '/en/people/_' })
  })

  it('serves listing pages, their segment files and the shell itself as they are', () => {
    expect(resolvePage('/people')).toEqual({ kind: 'asset' })
    expect(resolvePage('/people/')).toEqual({ kind: 'asset' })
    expect(resolvePage('/people/__next._tree.txt')).toEqual({ kind: 'asset' })
    expect(resolvePage('/people/_')).toEqual({ kind: 'asset' })
    expect(resolvePage('/es/people/_.txt')).toEqual({ kind: 'asset' })
  })

  it('gates the auth pages and the pages that need a session, keeping the locale of the fallback', () => {
    expect(resolvePage('/sign-in')).toEqual({ kind: 'gated', requiresSession: false, fallback: '/app' })
    expect(resolvePage('/es/reset-password')).toEqual({ kind: 'gated', requiresSession: false, fallback: '/es/app' })
    expect(resolvePage('/friends')).toEqual({ kind: 'gated', requiresSession: true, fallback: '/sign-in' })
    expect(resolvePage('/ja/messages')).toEqual({ kind: 'gated', requiresSession: true, fallback: '/ja/sign-in' })
    expect(resolvePage('/sign-in.txt')).toEqual({ kind: 'asset' })
    expect(resolvePage('/friends/__next._tree.txt')).toEqual({ kind: 'asset' })
  })
})

describe('wrangler run_worker_first', () => {
  it('runs the worker for every page it routes', () => {
    const patterns: string[] = JSON.parse(wranglerConfig).assets.run_worker_first

    for (const page of [...SIGNED_OUT_PAGES, ...SIGNED_IN_PAGES]) {
      expect(patterns).toContain(page)
      expect(patterns).toContain(`/*${page}`)
    }
    for (const base of DYNAMIC_PAGE_ROUTES) {
      expect(patterns).toContain(`${base}/*`)
      expect(patterns).toContain(`/*${base}/*`)
    }
  })
})
