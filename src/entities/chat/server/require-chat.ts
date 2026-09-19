import Conversation, { type ConversationDocument } from '@/entities/chat/model/conversation'
import connectDB from '@/shared/config/mongodb/mongodb'
import { requireUser } from '@/shared/api/require-user'
import { badRequest, notFound } from '@/shared/api/responses'
import { objectIdSchema } from '@/shared/api/zod-helpers'

export type ChatIdParams = { params: Promise<{ chatId: string }> }

export async function requireChat({ params }: ChatIdParams) {
  const userId = await requireUser()
  if (userId instanceof Response) return userId

  const chatId = (await params).chatId
  if (!objectIdSchema.safeParse(chatId).success) return badRequest('Invalid chat id')

  await connectDB()

  const chat = await Conversation.findOne({ _id: chatId, members: userId }).lean<ConversationDocument>()
  if (!chat) return notFound('Chat not found')

  return { userId, chat }
}
