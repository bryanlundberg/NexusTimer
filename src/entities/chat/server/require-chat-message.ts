import type { MessageDocument } from '@/entities/chat/model/message'
import Message from '@/entities/chat/model/message'
import { findConversationId } from '@/entities/chat/server/chat'
import connectDB from '@/shared/config/mongodb/mongodb'
import { requireUserPair } from '@/shared/api/require-user-pair'
import { badRequest, notFound } from '@/shared/api/responses'
import { objectIdSchema } from '@/shared/api/zod-helpers'

export type MessageIdParams = { params: Promise<{ userId: string; messageId: string }> }

/**
 * Resolves the signed-in user, the other member and the target message, making sure the
 * message really belongs to their conversation. Returns a 400/401/404 response otherwise.
 */
export async function requireChatMessage(context: MessageIdParams) {
  const ids = await requireUserPair(context)
  if (ids instanceof Response) return ids

  const { messageId } = await context.params
  if (!objectIdSchema.safeParse(messageId).success) return badRequest('Invalid message id')

  await connectDB()

  const conversation = await findConversationId(ids.userId, ids.otherId)
  if (!conversation) return notFound('Conversation not found')

  const message = await Message.findOne({ _id: messageId, conversationId: conversation._id }).lean<MessageDocument>()
  if (!message) return notFound('Message not found')

  return { ...ids, message }
}
