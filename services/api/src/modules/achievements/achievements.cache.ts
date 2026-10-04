import type { AchievementRarityInput } from '@nexustimer/contracts'
import type { RedisClientType } from 'redis'
import { logger, serializeError } from '../../lib/logger'

const RARITY_KEY = 'achievement:rarity'

export type RarityCache = { set(stats: AchievementRarityInput): Promise<void> }

export function createRarityCache(redis: () => Promise<RedisClientType>): RarityCache {
  return {
    async set(stats) {
      try {
        await (await redis()).set(RARITY_KEY, JSON.stringify(stats))
      } catch (error) {
        logger.warn('rarity cache write failed', { error: serializeError(error) })
      }
    }
  }
}
