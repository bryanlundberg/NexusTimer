import type { MiddlewareHandler } from 'hono'
import { unauthorized } from './responses'

export type SessionLookup = { userId: string | null; headers: Headers }
export type SessionReader = (headers: Headers) => Promise<SessionLookup>
export type UserEnv = { Variables: { userId: string } }
export type ViewerEnv = { Variables: { viewerId: string | null } }

export function requireUser(readSession: SessionReader): MiddlewareHandler<UserEnv> {
  return async (c, next) => {
    const { userId, headers } = await readSession(c.req.raw.headers)
    const cookies = headers.getSetCookie()

    if (!userId) {
      const res = unauthorized()
      for (const cookie of cookies) res.headers.append('set-cookie', cookie)
      return res
    }

    c.set('userId', userId)
    await next()
    for (const cookie of cookies) c.header('set-cookie', cookie, { append: true })
  }
}

export function optionalUser(readSession: SessionReader): MiddlewareHandler<ViewerEnv> {
  return async (c, next) => {
    const { userId, headers } = await readSession(c.req.raw.headers)
    c.set('viewerId', userId)
    await next()
    for (const cookie of headers.getSetCookie()) c.header('set-cookie', cookie, { append: true })
  }
}
