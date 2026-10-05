import { Schema, model } from 'mongoose'

const userAchievementSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    key: { type: String, required: true }
  },
  { timestamps: true }
)

userAchievementSchema.index({ userId: 1, key: 1 }, { unique: true })

export const UserAchievementModel = model('UserAchievement', userAchievementSchema)

export const ACHIEVEMENT_RARITY_ID = 'current'

const rarityEntrySchema = new Schema(
  {
    holders: { type: Number, required: true },
    pct: { type: Number, required: true }
  },
  { _id: false }
)

const achievementRaritySchema = new Schema(
  {
    _id: { type: String, default: ACHIEVEMENT_RARITY_ID },
    registeredUsers: { type: Number, required: true },
    scannedUsers: { type: Number, required: true },
    failedUsers: { type: Number, required: true, default: 0 },
    computedAt: { type: Date, required: true },
    badges: { type: Map, of: rarityEntrySchema, required: true }
  },
  { timestamps: true, _id: false }
)

export const AchievementRarityModel = model('AchievementRarity', achievementRaritySchema)
