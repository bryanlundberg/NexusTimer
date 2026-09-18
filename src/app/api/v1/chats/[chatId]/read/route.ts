import { NextRequest } from 'next/server'
import Conversation from '@/entities/chat/model/conversation'
import { memberIds } from '@/entities/chat/server/chat'
import { requireChat, type ChatIdParams } from '@/entities/chat/server/require-chat'
import { ok, serverError } from '@/shared/api/responses'
import { publishToChat, publishToUser } from '@/shared/lib/realtime/publish'

export async function POST(_request: NextRequest, context: ChatIdParams) {
  try {
    const target = await requireChat(context)
    if (target instanceof Response) return target
    const { userId, chat } = target

    const readAt = new Date()
    const result = await Conversation.updateOne(
      { _id: chat._id, [`unread.${userId}`]: { $gt: 0 } },
      { $set: { [`unread.${userId}`]: 0, [`readAt.${userId}`]: readAt, [`deliveredAt.${userId}`]: readAt } }
    )

    if (result.modifiedCount > 0) {
      const chatId = chat._id.toString()
      await Promise.all([
        publishToUser(userId, { type: 'chat:read', chatId }),
        publishToChat(
          memberIds(chat).filter((memberId) => memberId !== userId),
          { type: 'chat:seen', chatId, readAt: readAt.toISOString() }
        )
      ])
    }

    return ok({ unread: 0 })
  } catch (error) {
    return serverError('chats/[chatId]/read:POST', error)
  }
}
