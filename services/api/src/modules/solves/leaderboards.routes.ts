import { leaderboardsQuerySchema, type LeaderboardsResponse } from '@nexustimer/contracts'
import { Hono } from 'hono'
import { ok, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { parseQuery } from '../../http/validation'
import type { LeaderboardsService } from './leaderboards.service'

export function leaderboardsRoutes(leaderboards: LeaderboardsService) {
  return new Hono<AppEnv>().get('/', async (c) => {
    const query = parseQuery(c.req.url, leaderboardsQuerySchema)
    if (query instanceof Response) return query

    try {
      const { solves, nextRefreshAt, secondsUntilNextRefresh } = await leaderboards.get(query)
      const res = ok<LeaderboardsResponse>({ solves, nextRefreshAt })
      res.headers.set('cache-control', `public, max-age=0, s-maxage=${secondsUntilNextRefresh}`)
      return res
    } catch (error) {
      return serverError('leaderboards:GET', error)
    }
  })
}
