import { Schema, models, model } from 'mongoose'

export interface UserAchievementDocument {
  _id: string
  userId: Schema.Types.ObjectId
  key: string
  createdAt: Date
  updatedAt: Date
}

const UserAchievementSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    key: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

UserAchievementSchema.index({ userId: 1, key: 1 }, { unique: true })

export default models.UserAchievement || model('UserAchievement', UserAchievementSchema)
