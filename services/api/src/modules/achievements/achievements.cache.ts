import type { AchievementRarityInput } from '@nexustimer/contracts'
import type { RedisClientType } from 'redis'
import { logger, serializeError } from '../../lib/logger'

const RARITY_KEY = 'achievement:rarity'

export type RarityCache = {
  get(): Promise<AchievementRarityInput | null>
  set(stats: AchievementRarityInput): Promise<void>
}

export function createRarityCache(redis: () => Promise<RedisClientType>): RarityCache {
  return {
    async get() {
      try {
        const cached = await (await redis()).get(RARITY_KEY)
        return cached ? (JSON.parse(cached) as AchievementRarityInput) : null
      } catch (error) {
        logger.warn('rarity cache read failed', { error: serializeError(error) })
        return null
      }
    },
    async set(stats) {
      try {
        await (await redis()).set(RARITY_KEY, JSON.stringify(stats))
      } catch (error) {
        logger.warn('rarity cache write failed', { error: serializeError(error) })
      }
    }
  }
}
