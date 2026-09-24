import type { Metadata } from 'next'
import { locales, localizedPath } from '@/shared/config/i18n/locales'

export const localizedAlternates = (locale: string, path: string): Metadata['alternates'] => ({
  canonical: localizedPath(locale, path),
  languages: {
    ...Object.fromEntries(locales.map((code) => [code, localizedPath(code, path)])),
    'x-default': path
  }
})
