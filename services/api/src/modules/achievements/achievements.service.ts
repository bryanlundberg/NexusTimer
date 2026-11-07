import type { AchievementRarityInput, AchievementRarityResponse } from '@nexustimer/contracts'
import type { RarityCache } from './achievements.cache'
import type { AchievementsRepository, GrantedAchievement } from './achievements.repository'

export type AchievementsService = {
  grantedKeys(userId: string): Promise<string[]>
  list(userId: string): Promise<GrantedAchievement[]>
  grant(userId: string, key: string): Promise<GrantedAchievement>
  revoke(userId: string, key: string): Promise<number>
  saveRarity(stats: AchievementRarityInput): Promise<void>
  rarity(): Promise<AchievementRarityResponse>
}

function toRarityResponse(stats: AchievementRarityInput): NonNullable<AchievementRarityResponse> {
  return {
    computedAt: new Date(stats.computedAt).toISOString(),
    badges: Object.fromEntries(Object.entries(stats.badges).map(([id, entry]) => [id, entry.pct]))
  }
}

export function createAchievementsService(
  repository: AchievementsRepository,
  rarityCache?: RarityCache
): AchievementsService {
  return {
    grantedKeys: (userId) => repository.grantedKeys(userId),
    list: (userId) => repository.list(userId),
    grant: (userId, key) => repository.grant(userId, key),
    revoke: (userId, key) => repository.revoke(userId, key),
    async saveRarity(stats) {
      await repository.saveRarity(stats)
      await rarityCache?.set(stats)
    },
    async rarity() {
      const cached = await rarityCache?.get()
      if (cached) return toRarityResponse(cached)
      const stored = await repository.rarity()
      if (!stored) return null
      await rarityCache?.set(stored)
      return toRarityResponse(stored)
    }
  }
}
