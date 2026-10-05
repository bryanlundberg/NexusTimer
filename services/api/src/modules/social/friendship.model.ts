import { Schema, model } from 'mongoose'

export const DECLINED_TTL_SECONDS = 60 * 60 * 24 * 90

const friendshipSchema = new Schema(
  {
    pairKey: { type: String, required: true },
    users: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], required: true },
    requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], required: true },
    acceptedAt: { type: Date },
    declinedAt: { type: Date },
    withdrawnAt: { type: Date }
  },
  { timestamps: true }
)

friendshipSchema.index({ pairKey: 1 }, { unique: true })
friendshipSchema.index({ users: 1, status: 1, createdAt: -1 })
friendshipSchema.index(
  { declinedAt: 1 },
  { expireAfterSeconds: DECLINED_TTL_SECONDS, partialFilterExpression: { status: 'declined' } }
)

export const FriendshipModel = model('Friendship', friendshipSchema)
