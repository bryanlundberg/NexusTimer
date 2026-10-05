export const LOCALES: readonly string[] = [
  'en',
  'de',
  'es',
  'fr',
  'hi',
  'ja',
  'ko',
  'pt',
  'ru',
  'zh',
  'uk',
  'it',
  'pl',
  'id',
  'vi',
  'th',
  'fil'
]

export const DEFAULT_LOCALE = 'en'

export const LOCALE_COOKIE = 'NEXT_LOCALE'

export const localizedPath = (locale: string, path: string) =>
  locale === DEFAULT_LOCALE ? path : `/${locale}${path === '/' ? '' : path}`
