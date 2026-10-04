import { REQUEST_ID_HEADER } from '@nexustimer/contracts'
import type { MiddlewareHandler } from 'hono'
import type { AppEnv } from './types'

const MAX_LENGTH = 255
const VALID_ID = /^[\w\-=]+$/

export function requestId(): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const incoming = c.req.header(REQUEST_ID_HEADER)
    const id = incoming && incoming.length <= MAX_LENGTH && VALID_ID.test(incoming) ? incoming : crypto.randomUUID()
    c.set('requestId', id)
    await next()
    c.header(REQUEST_ID_HEADER, id)
  }
}
