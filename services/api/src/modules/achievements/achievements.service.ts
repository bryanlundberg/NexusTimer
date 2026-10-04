import type { AchievementsRepository } from './achievements.repository'

export type AchievementsService = {
  grantedKeys(userId: string): Promise<string[]>
}

export function createAchievementsService(repository: AchievementsRepository): AchievementsService {
  return {
    grantedKeys: (userId) => repository.grantedKeys(userId)
  }
}
