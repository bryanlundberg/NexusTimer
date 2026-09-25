export const locales = [
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

export const defaultLocale = 'en'

export const LOCALE_COOKIE = 'NEXT_LOCALE'

export const localizedPath = (locale, path) =>
  locale === defaultLocale ? path : `/${locale}${path === '/' ? '' : path}`
