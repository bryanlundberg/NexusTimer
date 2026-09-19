import { model, models, Schema, type Types } from 'mongoose'
import type { UserStatsSummary } from '@/entities/user-stats/model/types'

export interface UserStatsDocument {
  _id: Types.ObjectId
  user: Types.ObjectId
  version: number
  backupUpdatedAt: number
  summary: UserStatsSummary
  createdAt: Date
  updatedAt: Date
}

const UserStatsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user is required']
    },
    version: { type: Number, required: true },
    backupUpdatedAt: { type: Number, required: true },
    summary: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: true, minimize: false }
)

UserStatsSchema.index({ user: 1 }, { unique: true })

export default models.UserStats || model('UserStats', UserStatsSchema)
