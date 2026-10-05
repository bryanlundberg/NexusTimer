import { Schema, model } from 'mongoose'

const conversationSchema = new Schema(
  {
    pairKey: { type: String, required: true },
    members: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], required: true },
    lastMessage: {
      type: {
        messageId: { type: Schema.Types.ObjectId, ref: 'Message' },
        text: { type: String, default: '' },
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, required: true }
      },
      _id: false
    },
    lastMessageAt: { type: Date },
    unread: { type: Map, of: Number, default: {} },
    deliveredAt: { type: Map, of: Date, default: {} },
    readAt: { type: Map, of: Date, default: {} },
    clearedAt: { type: Map, of: Date, default: {} },
    hiddenAt: { type: Map, of: Date, default: {} },
    muted: { type: Map, of: Boolean, default: {} }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

conversationSchema.index({ pairKey: 1 }, { unique: true })
conversationSchema.index({ members: 1, lastMessageAt: -1 })

export const ConversationModel = model('Conversation', conversationSchema)
