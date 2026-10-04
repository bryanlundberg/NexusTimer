import type { ApiError } from '@nexustimer/contracts'
import { logger, serializeError } from '../lib/logger'

type Issues = NonNullable<ApiError['issues']>

const error = (status: number, message: string) => Response.json({ message } satisfies ApiError, { status })

export const ok = <T>(data: T) => Response.json(data)

export const created = <T>(data: T) => Response.json(data, { status: 201 })

export const noContent = () => new Response(null, { status: 204 })

export function badRequest(message = 'Invalid request', issues?: Issues) {
  const body: ApiError = { message }
  if (issues) body.issues = issues
  return Response.json(body, { status: 400 })
}

export const unauthorized = (message = 'Unauthorized') => error(401, message)

export const forbidden = (message = 'Forbidden') => error(403, message)

export const notFound = (message = 'Not found') => error(404, message)

export const conflict = (message = 'Conflict') => error(409, message)

export const tooManyRequests = (message = 'Too many requests') => error(429, message)

export const serviceUnavailable = (message = 'Service unavailable') => error(503, message)

export function serverError(scope: string, cause: unknown) {
  logger.error('handler failed', { scope, error: serializeError(cause) })
  return error(500, 'Internal server error')
}
