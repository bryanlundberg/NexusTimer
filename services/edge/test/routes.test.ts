import { describe, expect, it } from 'vitest'
import { isApiPath, resolvePage } from '../src/routes'

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
  it('negotiates the locale only at the root', () => {
    expect(resolvePage('/')).toEqual({ kind: 'negotiate' })
    expect(resolvePage('/es')).toEqual({ kind: 'asset' })
    expect(resolvePage('/app')).toEqual({ kind: 'asset' })
  })

  it('sends default locale prefixes to the unprefixed url', () => {
    expect(resolvePage('/en')).toEqual({ kind: 'redirect', location: '/' })
    expect(resolvePage('/en/app')).toEqual({ kind: 'redirect', location: '/app' })
    expect(resolvePage('/en/people/abc')).toEqual({ kind: 'redirect', location: '/people/abc' })
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

  it('keeps the locale prefix of non-default locales', () => {
    expect(resolvePage('/es/s/AbCdEf1234')).toMatchObject({ assetPath: '/es/s/_', isDocument: true })
    expect(resolvePage('/fil/people/abc.txt')).toMatchObject({ assetPath: '/fil/people/_.txt' })
  })

  it('serves listing pages, their segment files and the shell itself as they are', () => {
    expect(resolvePage('/people')).toEqual({ kind: 'asset' })
    expect(resolvePage('/people/')).toEqual({ kind: 'asset' })
    expect(resolvePage('/people/__next._tree.txt')).toEqual({ kind: 'asset' })
    expect(resolvePage('/people/_')).toEqual({ kind: 'asset' })
    expect(resolvePage('/es/people/_.txt')).toEqual({ kind: 'asset' })
  })
})
