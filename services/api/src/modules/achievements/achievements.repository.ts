import type { AchievementRarityInput } from '@nexustimer/contracts'
import { ACHIEVEMENT_RARITY_ID, AchievementRarityModel, UserAchievementModel } from './achievements.model'

export type GrantedAchievement = { key: string; createdAt: string }

export type AchievementsRepository = {
  grantedKeys(userId: string): Promise<string[]>
  list(userId: string): Promise<GrantedAchievement[]>
  grant(userId: string, key: string): Promise<GrantedAchievement>
  revoke(userId: string, key: string): Promise<number>
  saveRarity(stats: AchievementRarityInput): Promise<void>
}

type RawAchievement = { key: string; createdAt: Date }

const toGranted = (doc: RawAchievement): GrantedAchievement => ({
  key: doc.key,
  createdAt: new Date(doc.createdAt).toISOString()
})

export const achievementsRepository: AchievementsRepository = {
  async grantedKeys(userId) {
    const docs = await UserAchievementModel.find({ userId }, { key: 1, _id: 0 }).lean<{ key: string }[]>()
    return docs.map((doc) => doc.key)
  },

  async list(userId) {
    const docs = await UserAchievementModel.find({ userId }, { key: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .lean<RawAchievement[]>()
    return docs.map(toGranted)
  },

  async grant(userId, key) {
    const doc = await UserAchievementModel.findOneAndUpdate(
      { userId, key },
      { $setOnInsert: { userId, key } },
      { upsert: true, returnDocument: 'after' }
    ).lean<RawAchievement>()
    return toGranted(doc!)
  },

  async revoke(userId, key) {
    return (await UserAchievementModel.deleteOne({ userId, key })).deletedCount
  },

  async saveRarity(stats) {
    await AchievementRarityModel.replaceOne({ _id: ACHIEVEMENT_RARITY_ID }, stats, { upsert: true })
  }
}
