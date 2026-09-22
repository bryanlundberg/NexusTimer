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

export const localeCookieOptions = {
  path: '/',
  maxAge: 60 * 60 * 24 * 365,
  sameSite: /** @type {const} */ ('lax')
}

export const isLocale = (value) => locales.includes(value)
