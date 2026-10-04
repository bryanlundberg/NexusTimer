import { Schema, model } from 'mongoose'

const userStatsSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'user is required'] },
    version: { type: Number, required: true },
    backupUpdatedAt: { type: Number, required: true },
    summary: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: true, minimize: false }
)

userStatsSchema.index({ user: 1 }, { unique: true })

export const UserStatsModel = model('UserStats', userStatsSchema)
