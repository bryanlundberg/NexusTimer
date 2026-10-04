import { timingSafeEqual } from 'node:crypto'
import { CLIENT_IP_HEADER, EDGE_SECRET_HEADER } from '@nexustimer/contracts'
import type { MiddlewareHandler } from 'hono'
import { unauthorized } from './responses'
import type { AppEnv } from './types'

function safeEqual(provided: string, expected: string) {
  const left = Buffer.from(provided)
  const right = Buffer.from(expected)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function edgeGuard(secret: string | undefined): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    if (secret) {
      const provided = c.req.header(EDGE_SECRET_HEADER)
      if (!provided || !safeEqual(provided, secret)) return unauthorized()
      c.set('clientIp', c.req.header(CLIENT_IP_HEADER) ?? null)
    } else {
      c.set('clientIp', c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || null)
    }
    await next()
  }
}
