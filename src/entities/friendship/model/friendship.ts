import { Schema, models, model, type Types } from 'mongoose'

export type FriendshipStatus = 'pending' | 'accepted'

export interface FriendshipDocument {
  _id: Types.ObjectId
  pairKey: string
  users: Types.ObjectId[]
  requesterId: Types.ObjectId
  status: FriendshipStatus
  acceptedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export const pairKeyOf = (a: string, b: string) => (a < b ? `${a}:${b}` : `${b}:${a}`)

const FriendshipSchema = new Schema(
  {
    pairKey: { type: String, required: true },
    users: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], required: true },
    requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted'], required: true },
    acceptedAt: { type: Date }
  },
  { timestamps: true }
)

// `users` is multikey, so uniqueness lives on `pairKey` instead
FriendshipSchema.index({ pairKey: 1 }, { unique: true })
FriendshipSchema.index({ users: 1, status: 1, createdAt: -1 })

export default models.Friendship || model('Friendship', FriendshipSchema)
