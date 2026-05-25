import type { NextRequest } from 'next/server'

/**
 * Reads `?email=` from the request URL, trimming and lowercasing.
 * Returns `null` when the parameter is missing or empty.
 */
export function parseEmailParam(request: NextRequest) {
  return request.nextUrl.searchParams.get('email')?.trim().toLowerCase() || null
}
