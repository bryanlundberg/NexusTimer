import { friendsLeaderboardQuerySchema, type FriendsLeaderboardResponse } from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import type { UserEnv } from '../../http/require-user'
import { ok, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseQuery } from '../../http/validation'
import type { FriendsLeaderboardService } from './friends-leaderboards.service'

export function friendsLeaderboardRoutes(leaderboard: FriendsLeaderboardService, signedIn: MiddlewareHandler<UserEnv>) {
  return new Hono<AppEnv>().get('/', signedIn, async (c) => {
    const query = parseQuery(c.req.url, friendsLeaderboardQuerySchema)
    if (query instanceof Response) return query

    try {
      const res = ok<FriendsLeaderboardResponse>(await leaderboard.get(c.var.userId, query))
      res.headers.set('cache-control', 'private, no-store')
      return res
    } catch (error) {
      return serverError('leaderboards/friends:GET', error)
    }
  })
}
