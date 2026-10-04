import { Schema, model } from 'mongoose'

const friendRequestEmailLogSchema = new Schema(
  { pairKey: { type: String, required: true } },
  { timestamps: { createdAt: true, updatedAt: false } }
)

friendRequestEmailLogSchema.index({ pairKey: 1 }, { unique: true })

export const FriendRequestEmailLogModel = model('FriendRequestEmailLog', friendRequestEmailLogSchema)
