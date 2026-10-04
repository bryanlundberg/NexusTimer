import type { ApiError } from '@nexustimer/contracts'
import type { ErrorHandler, NotFoundHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { logger, serializeError } from '../lib/logger'
import { notFound } from './responses'
import type { AppEnv } from './types'

export const handleNotFound: NotFoundHandler<AppEnv> = () => notFound()

export const handleError: ErrorHandler<AppEnv> = (error, c) => {
  if (error instanceof HTTPException) {
    return (
      error.res ??
      Response.json({ message: error.message || 'Request failed' } satisfies ApiError, { status: error.status })
    )
  }

  logger.error('unhandled error', {
    requestId: c.var.requestId,
    method: c.req.method,
    path: c.req.path,
    error: serializeError(error)
  })
  return Response.json({ message: 'Internal server error' } satisfies ApiError, { status: 500 })
}
