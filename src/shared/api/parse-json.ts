import type { NextRequest } from 'next/server'
import type { z } from 'zod'
import { badRequest } from './responses'

/**
 * Reads the JSON body of `request` and validates it against `schema`.
 * Returns the parsed data on success, or a 400 NextResponse on failure.
 * Use: `const body = await parseJsonBody(req, schema); if (body instanceof Response) return body`
 */
export async function parseJsonBody<S extends z.ZodSchema>(request: NextRequest | Request, schema: S) {
  const raw = await request.json().catch(() => null)
  const parsed = schema.safeParse(raw)
  if (!parsed.success) return badRequest('Invalid request', parsed.error.issues)
  return parsed.data as z.infer<S>
}
