import { NextRequest } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import Conversation from '@/entities/chat/model/conversation'
import { findConversationId } from '@/entities/chat/server/chat'
import { requireUserPair, type UserIdParams } from '@/shared/api/require-user-pair'
import { noContent, serverError } from '@/shared/api/responses'
import { publishToUser } from '@/shared/lib/realtime/publish'

/**
 * Removes the conversation from this side only: the history stops being visible here and
 * the thread leaves the inbox. It comes back on its own as soon as a new message arrives.
 */
export async function DELETE(_request: NextRequest, context: UserIdParams) {
  try {
    const ids = await requireUserPair(context)
    if (ids instanceof Response) return ids
    const { userId, otherId } = ids

    await connectDB()

    const conversation = await findConversationId(userId, otherId)
    if (!conversation) return noContent()

    const now = new Date()
    await Conversation.updateOne(
      { _id: conversation._id },
      { $set: { [`clearedAt.${userId}`]: now, [`hiddenAt.${userId}`]: now, [`unread.${userId}`]: 0 } }
    )

    await publishToUser(userId, { type: 'chat:removed', userId: otherId })
    return noContent()
  } catch (error) {
    return serverError('chats/[userId]:DELETE', error)
  }
}
