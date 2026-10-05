import { describe, expect, it, vi } from 'vitest'
import { applySavedLocale, type SavedLocaleConfig } from '@/shared/config/i18n/applySavedLocale'
import { defaultLocale, locales } from '@/shared/config/i18n/locales'
import { localeCookie } from '@/shared/config/i18n/routing'

const config: SavedLocaleConfig = { locales, defaultLocale, cookie: localeCookie }

function visit(url: string, cookie = '', languages: string[] = [], apply = applySavedLocale) {
  const { pathname, search, hash } = new URL(url, 'https://nexustimer.com')
  const replace = vi.fn()
  const writes: string[] = []
  const document = {
    get cookie() {
      return cookie
    },
    set cookie(value: string) {
      writes.push(value)
    }
  }
  apply({ pathname, search, hash, replace }, document, languages, config)
  return { redirect: replace.mock.calls[0]?.[0], saved: writes.map((value) => value.split(';')[0]) }
}

describe('applySavedLocale', () => {
  it('shows a prefixed url in its locale and saves it', () => {
    expect(visit('/ja/cubes', 'theme=dark; NEXT_LOCALE=ru', ['es'])).toEqual({
      redirect: undefined,
      saved: ['NEXT_LOCALE=ja']
    })
    expect(visit('/ja', '', ['es'])).toEqual({ redirect: undefined, saved: ['NEXT_LOCALE=ja'] })
    expect(visit('/ru/s/AbCdEf1234', 'NEXT_LOCALE=ru')).toEqual({ redirect: undefined, saved: [] })
  })

  it('moves an unprefixed url to the saved locale, keeping the path, query and hash', () => {
    expect(visit('/app?tab=stats#top', 'NEXT_LOCALE=ru', ['es'])).toEqual({
      redirect: '/ru/app?tab=stats#top',
      saved: []
    })
    expect(visit('/', 'NEXT_LOCALE=ru')).toEqual({ redirect: '/ru', saved: [] })
  })

  it('keeps an unprefixed url in english when english is saved', () => {
    expect(visit('/app', 'NEXT_LOCALE=en', ['es'])).toEqual({ redirect: undefined, saved: [] })
  })

  it('without a saved locale, saves the browser locale of an unprefixed url and moves to it', () => {
    expect(visit('/cubes', '', ['pt-BR', 'en'])).toEqual({ redirect: '/pt/cubes', saved: ['NEXT_LOCALE=pt'] })
    expect(visit('/', 'NEXT_LOCALE=xx', ['zh-CN'])).toEqual({ redirect: '/zh', saved: ['NEXT_LOCALE=zh'] })
    expect(visit('/cubes', '', ['nl'])).toEqual({ redirect: undefined, saved: ['NEXT_LOCALE=en'] })
  })

  it('runs on its own as an inline script', () => {
    const inline = new Function(
      'location',
      'document',
      'languages',
      'config',
      `(${applySavedLocale.toString()})(location, document, languages, config)`
    ) as typeof applySavedLocale

    expect(visit('/app', 'NEXT_LOCALE=ru', [], inline)).toEqual({ redirect: '/ru/app', saved: [] })
  })
})
