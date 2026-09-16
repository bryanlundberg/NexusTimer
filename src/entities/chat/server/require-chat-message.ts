import type { MessageDocument } from '@/entities/chat/model/message'
import Message from '@/entities/chat/model/message'
import { requireChat, type ChatIdParams } from '@/entities/chat/server/require-chat'
import { badRequest, notFound } from '@/shared/api/responses'
import { objectIdSchema } from '@/shared/api/zod-helpers'

export type MessageIdParams = { params: Promise<{ chatId: string; messageId: string }> }

/**
 * Resolves the signed-in user, their conversation and the target message, making sure the
 * message really belongs to that conversation. Returns a 400/401/404 response otherwise.
 */
export async function requireChatMessage(context: MessageIdParams) {
  const target = await requireChat(context)
  if (target instanceof Response) return target

  const { messageId } = await context.params
  if (!objectIdSchema.safeParse(messageId).success) return badRequest('Invalid message id')

  const message = await Message.findOne({ _id: messageId, conversationId: target.chat._id }).lean<MessageDocument>()
  if (!message) return notFound('Message not found')

  return { ...target, message }
}
