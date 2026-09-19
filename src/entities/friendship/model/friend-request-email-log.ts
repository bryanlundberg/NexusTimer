import { Schema, models, model, type Types } from 'mongoose'

export interface FriendRequestEmailLogDocument {
  _id: Types.ObjectId
  pairKey: string
  createdAt: Date
}

const FriendRequestEmailLogSchema = new Schema(
  { pairKey: { type: String, required: true } },
  { timestamps: { createdAt: true, updatedAt: false } }
)

FriendRequestEmailLogSchema.index({ pairKey: 1 }, { unique: true })

export default models.FriendRequestEmailLog || model('FriendRequestEmailLog', FriendRequestEmailLogSchema)
