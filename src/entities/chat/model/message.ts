import { Schema, models, model, type Types } from 'mongoose'
import { MAX_MESSAGE_LENGTH } from '@/entities/chat/model/types'

export interface MessageDocument {
  _id: Types.ObjectId
  conversationId: Types.ObjectId
  senderId: Types.ObjectId
  text: string
  createdAt: Date
}

const MessageSchema = new Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, maxlength: MAX_MESSAGE_LENGTH }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

MessageSchema.index({ conversationId: 1, _id: -1 })

export default models.Message || model('Message', MessageSchema)
