import type { RealtimeTicketResponse } from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import type { UserEnv } from '../../http/require-user'
import { ok, serviceUnavailable } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { createTicket } from './realtime.service'

export type RealtimeConfig = { url?: string; secret?: string }

export function realtimeRoutes(config: RealtimeConfig, auth: MiddlewareHandler<UserEnv>) {
  return new Hono<AppEnv>().post('/ticket', auth, (c) => {
    if (!config.url || !config.secret) return serviceUnavailable('Realtime is not configured')
    const ticket = createTicket({ userId: c.var.userId, ...c.var.profile }, config.secret)
    return ok<RealtimeTicketResponse>({ url: config.url, ticket })
  })
}
