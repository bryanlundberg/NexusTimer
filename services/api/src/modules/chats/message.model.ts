import { MAX_MESSAGE_LENGTH, MAX_REACTION_LENGTH } from '@nexustimer/contracts'
import { Schema, model } from 'mongoose'

const reactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    emoji: { type: String, required: true, maxlength: MAX_REACTION_LENGTH },
    createdAt: { type: Date, required: true, default: Date.now }
  },
  { _id: false }
)

const messageSchema = new Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Not required: deleting for everyone clears it. Non-empty is enforced by the route schema.
    text: { type: String, default: '', maxlength: MAX_MESSAGE_LENGTH },
    editedAt: { type: Date },
    deletedAt: { type: Date },
    deletedFor: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: undefined },
    reactions: { type: [reactionSchema], default: undefined }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

messageSchema.index({ conversationId: 1, _id: -1 })

export const MessageModel = model('Message', messageSchema)
