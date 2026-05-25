import type { NextRequest } from 'next/server'
import { unauthorized } from './responses'

/**
 * Pure check: does the request carry a valid `x-admin-token`?
 * Useful when the caller wants to keep its own error response shape.
 */
export function isAdminAuthorized(request: NextRequest) {
  const expected = process.env.ADMIN_TOKEN
  const token = request.headers.get('x-admin-token')
  return Boolean(expected && token && token === expected)
}

/**
 * Validates the `x-admin-token` header against `process.env.ADMIN_TOKEN`.
 * Returns `null` when authorized, or a 401 NextResponse when not.
 * Use: `const denied = requireAdmin(req); if (denied) return denied`
 */
export function requireAdmin(request: NextRequest) {
  if (!isAdminAuthorized(request)) return unauthorized()
  return null
}
