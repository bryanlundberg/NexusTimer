import { LOCALES } from '@nexustimer/contracts'

const SUPPORTED = new Set(LOCALES)

export function splitLocale(pathname: string): { locale: string | null; path: string } {
  const [, first = '', ...rest] = pathname.split('/')
  if (!SUPPORTED.has(first)) return { locale: null, path: pathname }
  return { locale: first, path: `/${rest.join('/')}` }
}
