import { localizedAlternates } from '@/shared/config/i18n/alternates'
import { locales, localizedPath } from '@/shared/config/i18n/locales'

describe('localized paths', () => {
  it('keeps english unprefixed', () => {
    expect(localizedPath('en', '/')).toBe('/')
    expect(localizedPath('en', '/algorithms/oll')).toBe('/algorithms/oll')
  })

  it('prefixes other locales', () => {
    expect(localizedPath('es', '/')).toBe('/es')
    expect(localizedPath('fil', '/algorithms/oll')).toBe('/fil/algorithms/oll')
  })

  it('builds canonical and hreflang alternates for the rendered locale', () => {
    const alternates = localizedAlternates('de', '/algorithms/pll')

    expect(alternates?.canonical).toBe('/de/algorithms/pll')
    expect(Object.keys(alternates?.languages ?? {})).toEqual([...locales, 'x-default'])
    expect(alternates?.languages).toMatchObject({
      en: '/algorithms/pll',
      ja: '/ja/algorithms/pll',
      'x-default': '/algorithms/pll'
    })
  })
})
