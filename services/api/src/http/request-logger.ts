import type { MiddlewareHandler } from 'hono'
import { logger } from '../lib/logger'
import type { AppEnv } from './types'

export function requestLogger(): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const start = performance.now()
    await next()
    logger.info('request', {
      requestId: c.var.requestId,
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      ms: Math.round(performance.now() - start)
    })
  }
}
