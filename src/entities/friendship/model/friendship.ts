import { Schema, models, model, type Types } from 'mongoose'

export type FriendshipStatus = 'pending' | 'accepted' | 'declined'

export interface FriendshipDocument {
  _id: Types.ObjectId
  pairKey: string
  users: Types.ObjectId[]
  requesterId: Types.ObjectId
  status: FriendshipStatus
  acceptedAt?: Date
  declinedAt?: Date
  withdrawnAt?: Date
  createdAt: Date
  updatedAt: Date
}

export const DECLINED_TTL_SECONDS = 60 * 60 * 24 * 90

const FriendshipSchema = new Schema(
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

// `users` is multikey, so uniqueness lives on `pairKey` instead
FriendshipSchema.index({ pairKey: 1 }, { unique: true })
FriendshipSchema.index({ users: 1, status: 1, createdAt: -1 })
FriendshipSchema.index(
  { declinedAt: 1 },
  { expireAfterSeconds: DECLINED_TTL_SECONDS, partialFilterExpression: { status: 'declined' } }
)

export default models.Friendship || model('Friendship', FriendshipSchema)
