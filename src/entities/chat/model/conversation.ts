import { Schema, models, model, type Types } from 'mongoose'

export interface ConversationDocument {
  _id: Types.ObjectId
  pairKey: string
  members: Types.ObjectId[]
  lastMessage?: {
    text: string
    senderId: Types.ObjectId
    createdAt: Date
  }
  lastMessageAt?: Date
  unread?: Record<string, number>
  /** When each member's app received the messages, which turns one check into two. */
  deliveredAt?: Record<string, Date>
  readAt?: Record<string, Date>
  createdAt: Date
}

const ConversationSchema = new Schema(
  {
    pairKey: { type: String, required: true },
    members: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], required: true },
    lastMessage: {
      type: {
        text: { type: String, required: true },
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, required: true }
      },
      _id: false
    },
    lastMessageAt: { type: Date },
    unread: { type: Map, of: Number, default: {} },
    deliveredAt: { type: Map, of: Date, default: {} },
    readAt: { type: Map, of: Date, default: {} }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

// `members` is multikey, so uniqueness lives on `pairKey` instead
ConversationSchema.index({ pairKey: 1 }, { unique: true })
ConversationSchema.index({ members: 1, lastMessageAt: -1 })

export default models.Conversation || model('Conversation', ConversationSchema)
