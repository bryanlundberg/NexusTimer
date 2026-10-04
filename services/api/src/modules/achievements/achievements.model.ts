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
