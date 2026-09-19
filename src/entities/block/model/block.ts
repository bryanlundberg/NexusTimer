import { Schema, models, model, type Types } from 'mongoose'

export interface BlockDocument {
  _id: Types.ObjectId
  blockerId: Types.ObjectId
  blockedId: Types.ObjectId
  createdAt: Date
}

const BlockSchema = new Schema(
  {
    blockerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    blockedId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

BlockSchema.index({ blockerId: 1, blockedId: 1 }, { unique: true })
BlockSchema.index({ blockedId: 1 })

export default models.Block || model('Block', BlockSchema)
