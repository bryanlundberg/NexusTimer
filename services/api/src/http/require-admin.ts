import { timingSafeEqual } from 'node:crypto'
import { ADMIN_TOKEN_HEADER } from '@nexustimer/contracts'
import type { MiddlewareHandler } from 'hono'
import { unauthorized } from './responses'
import type { AppEnv } from './types'

function matches(provided: string, expected: string) {
  const left = Buffer.from(provided)
  const right = Buffer.from(expected)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function requireAdmin(token: string | undefined): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const provided = c.req.header(ADMIN_TOKEN_HEADER)
    if (!token || !provided || !matches(provided, token)) return unauthorized()
    await next()
  }
}
