import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES } from '@nexustimer/contracts'

const SUPPORTED = new Set(LOCALES)

function cookieLocale(header: string | null): string | null {
  if (!header) return null
  for (const part of header.split(';')) {
    const [name, value] = part.trim().split('=')
    if (name === LOCALE_COOKIE && value && SUPPORTED.has(value)) return value
  }
  return null
}

function acceptedLocale(header: string | null): string | null {
  if (!header) return null
  const ranked = header
    .split(',')
    .map((entry) => {
      const [tag = '', ...params] = entry.trim().split(';')
      const q = params.map((param) => param.trim()).find((param) => param.startsWith('q='))
      return { tag: tag.toLowerCase(), q: q ? Number(q.slice(2)) : 1 }
    })
    .filter(({ tag, q }) => tag && tag !== '*' && q > 0)
    .sort((a, b) => b.q - a.q)

  for (const { tag } of ranked) {
    if (SUPPORTED.has(tag)) return tag
    const base = tag.split('-')[0]!
    if (SUPPORTED.has(base)) return base
  }
  return null
}

export function negotiateLocale(request: Request): string {
  return (
    cookieLocale(request.headers.get('cookie')) ??
    acceptedLocale(request.headers.get('accept-language')) ??
    DEFAULT_LOCALE
  )
}

export function splitLocale(pathname: string): { locale: string | null; path: string } {
  const [, first = '', ...rest] = pathname.split('/')
  if (!SUPPORTED.has(first)) return { locale: null, path: pathname }
  return { locale: first, path: `/${rest.join('/')}` }
}
