import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from '@/shared/config/i18n/locales'

export function middleware(request: NextRequest) {
  // Cookie already set — locale preference is known, nothing to do
  if (request.cookies.has('NEXT_LOCALE')) return NextResponse.next()

  // Detect preferred locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const detected = acceptLanguage
    .split(',')
    .map((entry) => entry.split(';')[0].trim().toLowerCase().slice(0, 2))
    .find((lang) => (locales as readonly string[]).includes(lang))

  const locale = detected ?? defaultLocale

  // English users: default already applies, let the request proceed as-is
  if (locale === defaultLocale) return NextResponse.next()

  // Non-English first visit: redirect to same URL with locale cookie set.
  // The redirect forces a new request so getRequestConfig picks up the cookie.
  const response = NextResponse.redirect(request.url)
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  })
  return response
}

export const config = {
  // Skip: API routes, Next.js internals, static files (anything with a file extension)
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|.*\\..+).*)']
}
