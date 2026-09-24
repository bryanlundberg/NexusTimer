import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  defaultLocale,
  isLocale,
  isLocalizedPath,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  localeCookieOptions
} from '@/shared/config/i18n/locales'

export function proxy(request: NextRequest) {
  const [, pathLocale, ...rest] = request.nextUrl.pathname.split('/')
  const target = `/${rest.join('/')}`.replace(/(.)\/$/, '$1')

  // Public pages under a locale prefix (/es, /es/algorithms/oll): crawlable per-language URLs.
  // The app itself stays unprefixed and follows the cookie.
  if (isLocale(pathLocale) && isLocalizedPath(target)) {
    const url = new URL(`${target}${request.nextUrl.search}`, request.url)

    if (pathLocale === defaultLocale) {
      return NextResponse.redirect(url, 308)
    }

    const headers = new Headers(request.headers)
    headers.set(LOCALE_HEADER, pathLocale)
    const response = NextResponse.rewrite(url, { request: { headers } })
    if (!request.cookies.has(LOCALE_COOKIE)) {
      response.cookies.set(LOCALE_COOKIE, pathLocale, localeCookieOptions)
    }
    return response
  }

  // Cookie already set — locale preference is known, nothing to do
  if (request.cookies.has(LOCALE_COOKIE)) return NextResponse.next()

  // Detect preferred locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const detected = acceptLanguage
    .split(',')
    .map((entry) => entry.split(';')[0].trim().toLowerCase().split('-')[0])
    .find(isLocale)

  const locale = detected ?? defaultLocale

  // English users: default already applies, let the request proceed as-is
  if (locale === defaultLocale) return NextResponse.next()

  // Non-English first visit: redirect to same URL with locale cookie set.
  // The redirect forces a new request so getRequestConfig picks up the cookie.
  const response = NextResponse.redirect(request.url)
  response.cookies.set(LOCALE_COOKIE, locale, localeCookieOptions)
  return response
}

export const config = {
  // Skip: API routes, Next.js internals, static files (anything with a file extension)
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|.*\\..+).*)']
}
