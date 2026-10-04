import { Schema, model } from 'mongoose'

const blockSchema = new Schema(
  {
    blockerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    blockedId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

blockSchema.index({ blockerId: 1, blockedId: 1 }, { unique: true })
blockSchema.index({ blockedId: 1 })

export const BlockModel = model('Block', blockSchema)
