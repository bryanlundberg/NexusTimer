import { SESSION_COOKIE } from '@nexustimer/contracts'

const SECURE_COOKIE_PREFIX = '__Secure-'

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('cookie')
  if (!header) return null
  for (const part of header.split(';')) {
    const separator = part.indexOf('=')
    if (separator !== -1 && part.slice(0, separator).trim() === name) return part.slice(separator + 1).trim()
  }
  return null
}

export function hasSessionCookie(request: Request): boolean {
  return Boolean(readCookie(request, `${SECURE_COOKIE_PREFIX}${SESSION_COOKIE}`) || readCookie(request, SESSION_COOKIE))
}
