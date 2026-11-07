import type { AchievementRarityResponse } from '@nexustimer/contracts'
import { Hono } from 'hono'
import { ok, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import type { AchievementsService } from './achievements.service'

const RARITY_CACHE = 'public, max-age=3600, s-maxage=21600'
const EMPTY_RARITY_CACHE = 'public, max-age=0, s-maxage=300'

export function achievementsRoutes(achievements: Pick<AchievementsService, 'rarity'>) {
  return new Hono<AppEnv>().get('/rarity', async (c) => {
    try {
      const rarity = await achievements.rarity()
      const res = ok<AchievementRarityResponse>(rarity)
      res.headers.set('cache-control', rarity ? RARITY_CACHE : EMPTY_RARITY_CACHE)
      return res
    } catch (error) {
      return serverError('achievements/rarity:GET', error)
    }
  })
}
