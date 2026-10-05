import type { z } from 'zod'
import { badRequest } from './responses'

export async function parseJson<S extends z.ZodTypeAny>(request: Request, schema: S): Promise<z.infer<S> | Response> {
  const raw: unknown = await request.json().catch(() => null)
  const parsed = schema.safeParse(raw)
  return parsed.success ? parsed.data : badRequest('Invalid request', parsed.error.issues)
}

export function parseQuery<S extends z.ZodTypeAny>(url: string, schema: S): z.infer<S> | Response {
  const parsed = schema.safeParse(Object.fromEntries(new URL(url).searchParams))
  return parsed.success ? parsed.data : badRequest('Invalid query', parsed.error.issues)
}
