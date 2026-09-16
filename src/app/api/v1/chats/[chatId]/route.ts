import { NextRequest } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import Conversation from '@/entities/chat/model/conversation'
import { otherMemberId, toChatSummary } from '@/entities/chat/server/chat'
import { requireChat, type ChatIdParams } from '@/entities/chat/server/require-chat'
import { findFriendUsers } from '@/entities/friendship/server/friends'
import { noContent, notFound, ok, serverError } from '@/shared/api/responses'
import { publishToUser } from '@/shared/lib/realtime/publish'

/** Who this conversation is with, for a window restored from storage or opened by id. */
export async function GET(_request: NextRequest, context: ChatIdParams) {
  try {
    const target = await requireChat(context)
    if (target instanceof Response) return target
    const { userId, chat } = target

    const users = await findFriendUsers([otherMemberId(chat, userId)])
    const user = users.get(otherMemberId(chat, userId))
    if (!user) return notFound('User not found')

    return ok(toChatSummary(chat, user, userId))
  } catch (error) {
    return serverError('chats/[chatId]:GET', error)
  }
}

/**
 * Removes the conversation from this side only: the history stops being visible here and
 * the thread leaves the inbox. It comes back on its own as soon as a new message arrives.
 */
export async function DELETE(_request: NextRequest, context: ChatIdParams) {
  try {
    const target = await requireChat(context)
    if (target instanceof Response) return target
    const { userId, chat } = target

    await connectDB()

    const now = new Date()
    await Conversation.updateOne(
      { _id: chat._id },
      { $set: { [`clearedAt.${userId}`]: now, [`hiddenAt.${userId}`]: now, [`unread.${userId}`]: 0 } }
    )

    await publishToUser(userId, { type: 'chat:removed', chatId: chat._id.toString() })
    return noContent()
  } catch (error) {
    return serverError('chats/[chatId]:DELETE', error)
  }
}
