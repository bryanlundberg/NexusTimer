import createMiddleware from 'next-intl/middleware'
import { routing } from '@/shared/config/i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Skip: API routes, Next.js internals, static files (anything with a file extension)
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|.*\\..+).*)']
}
