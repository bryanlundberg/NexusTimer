import { UserAchievementModel } from './achievements.model'

export type AchievementsRepository = {
  grantedKeys(userId: string): Promise<string[]>
}

export const achievementsRepository: AchievementsRepository = {
  async grantedKeys(userId) {
    const docs = await UserAchievementModel.find({ userId }, { key: 1, _id: 0 }).lean<{ key: string }[]>()
    return docs.map((doc) => doc.key)
  }
}
