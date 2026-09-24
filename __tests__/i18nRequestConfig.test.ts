import type { Mock } from 'vitest'

vi.mock('next-intl/server', () => ({
  getRequestConfig: (factory: unknown) => factory
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
  headers: vi.fn()
}))

import { cookies, headers } from 'next/headers'
import requestConfig from '@/shared/config/i18n/request'
import { readFileSync } from 'node:fs'
import path from 'node:path'

type Messages = Record<string, unknown>

const en: Messages = JSON.parse(readFileSync(path.resolve(__dirname, '../messages/en.json'), 'utf8'))
const loadConfig = requestConfig as unknown as () => Promise<{ locale: string; messages: Messages }>

const setLocale = (locale?: string, pathLocale?: string) => {
  ;(cookies as unknown as Mock).mockResolvedValue({
    get: () => (locale ? { value: locale } : undefined)
  })
  ;(headers as unknown as Mock).mockResolvedValue({
    get: () => pathLocale ?? null
  })
}

const leafPaths = (value: unknown, prefix = ''): string[] =>
  value && typeof value === 'object'
    ? Object.entries(value).flatMap(([key, child]) => leafPaths(child, prefix ? `${prefix}.${key}` : key))
    : [prefix]

describe('i18n request config', () => {
  it('keeps every english key when the locale is missing some', async () => {
    setLocale('es')
    const { locale, messages } = await loadConfig()

    expect(locale).toBe('es')
    expect(leafPaths(messages)).toEqual(expect.arrayContaining(leafPaths(en)))
  })

  it('does not leak a previous locale into english messages', async () => {
    setLocale('es')
    await loadConfig()
    setLocale()
    const { locale, messages } = await loadConfig()

    expect(locale).toBe('en')
    expect(messages).toEqual(en)
  })

  it('prefers the locale from a localized landing url over the cookie', async () => {
    setLocale('fr', 'ja')
    const { locale } = await loadConfig()

    expect(locale).toBe('ja')
  })

  it('ignores an unknown locale header', async () => {
    setLocale('fr', 'xx')
    const { locale } = await loadConfig()

    expect(locale).toBe('fr')
  })
})
