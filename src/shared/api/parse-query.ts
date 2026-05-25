import type { NextRequest } from 'next/server'
import type { ZodSchema, infer as zInfer } from 'zod'
import { badRequest } from './responses'

/**
 * Validates `request.nextUrl.searchParams` against `schema` using a plain object
 * built from the search params (so `z.coerce.*` and `.optional()` work).
 * Returns the parsed data on success, or a 400 NextResponse on failure.
 */
export function parseSearchParams<S extends ZodSchema>(request: NextRequest, schema: S) {
  const obj: Record<string, string> = {}
  request.nextUrl.searchParams.forEach((value, key) => {
    obj[key] = value
  })
  const parsed = schema.safeParse(obj)
  if (!parsed.success) return badRequest('Invalid query', parsed.error.issues)
  return parsed.data as zInfer<S>
}
