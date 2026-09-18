import { Schema, models, model, type Types } from 'mongoose'
import { MAX_MESSAGE_LENGTH, MAX_REACTION_LENGTH } from '@/entities/chat/model/types'

export interface MessageReactionDocument {
  userId: Types.ObjectId
  emoji: string
  createdAt: Date
}

export interface MessageDocument {
  _id: Types.ObjectId
  conversationId: Types.ObjectId
  senderId: Types.ObjectId
  text: string
  createdAt: Date
  editedAt?: Date
  deletedAt?: Date
  deletedFor?: Types.ObjectId[]
  reactions?: MessageReactionDocument[]
}

const ReactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    emoji: { type: String, required: true, maxlength: MAX_REACTION_LENGTH },
    createdAt: { type: Date, required: true, default: Date.now }
  },
  { _id: false }
)

const MessageSchema = new Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Not required: deleting for everyone clears it. Non-empty is enforced by the route schema.
    text: { type: String, default: '', maxlength: MAX_MESSAGE_LENGTH },
    editedAt: { type: Date },
    deletedAt: { type: Date },
    deletedFor: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: undefined },
    reactions: { type: [ReactionSchema], default: undefined }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

MessageSchema.index({ conversationId: 1, _id: -1 })

export default models.Message || model('Message', MessageSchema)
