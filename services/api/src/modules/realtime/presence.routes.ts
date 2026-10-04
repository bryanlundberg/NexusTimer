import { presenceStatusSchema, type PresenceStatusResponse } from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import type { UserEnv } from '../../http/require-user'
import { ok, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseJson } from '../../http/validation'
import type { PresenceStore } from './presence.store'

export function presenceRoutes(presence: PresenceStore, signedIn: MiddlewareHandler<UserEnv>) {
  return new Hono<AppEnv>().patch('/me', signedIn, async (c) => {
    const body = await parseJson(c.req.raw, presenceStatusSchema)
    if (body instanceof Response) return body

    try {
      await presence.setStatus(c.var.userId, body.status)
      return ok<PresenceStatusResponse>({ status: body.status })
    } catch (error) {
      return serverError('presence:me:PATCH', error)
    }
  })
}
