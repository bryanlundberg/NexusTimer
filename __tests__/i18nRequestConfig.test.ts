import type { Mock } from 'vitest'

vi.mock('next-intl/server', () => ({
  getRequestConfig: (factory: unknown) => factory
}))

vi.mock('next/root-params', () => ({
  locale: vi.fn()
}))

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  })
}))

import * as rootParams from 'next/root-params'
import requestConfig from '@/shared/config/i18n/request'
import { readFileSync } from 'node:fs'
import path from 'node:path'

type Messages = Record<string, unknown>

const en: Messages = JSON.parse(readFileSync(path.resolve(__dirname, '../messages/en.json'), 'utf8'))
const loadConfig = (locale?: string) => {
  ;(rootParams.locale as Mock).mockResolvedValue(locale)
  return (requestConfig as unknown as () => Promise<{ locale: string; messages: Messages }>)()
}

const leafPaths = (value: unknown, prefix = ''): string[] =>
  value && typeof value === 'object'
    ? Object.entries(value).flatMap(([key, child]) => leafPaths(child, prefix ? `${prefix}.${key}` : key))
    : [prefix]

describe('i18n request config', () => {
  it('keeps every english key when the locale is missing some', async () => {
    const { locale, messages } = await loadConfig('es')

    expect(locale).toBe('es')
    expect(leafPaths(messages)).toEqual(expect.arrayContaining(leafPaths(en)))
  })

  it('does not leak a previous locale into english messages', async () => {
    await loadConfig('es')
    const { locale, messages } = await loadConfig('en')

    expect(locale).toBe('en')
    expect(messages).toEqual(en)
  })

  it('treats an unknown locale as not found', async () => {
    await expect(loadConfig('xx')).rejects.toThrow('NEXT_NOT_FOUND')
  })

  it('treats a missing locale root param as not found', async () => {
    await expect(loadConfig()).rejects.toThrow('NEXT_NOT_FOUND')
  })
})
