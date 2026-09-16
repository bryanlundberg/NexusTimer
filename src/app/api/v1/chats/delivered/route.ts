import connectDB from '@/shared/config/mongodb/mongodb'
import Conversation, { type ConversationDocument } from '@/entities/chat/model/conversation'
import { otherMemberId } from '@/entities/chat/server/chat'
import { INBOX_LIMIT } from '@/entities/chat/model/types'
import { requireUser } from '@/shared/api/require-user'
import { ok, serverError } from '@/shared/api/responses'
import { publishToUser } from '@/shared/lib/realtime/publish'

/**
 * Acknowledges every message received so far, turning the sender's single check into a double one.
 * Also called when the inbox loads, so it covers messages sent while the user was offline.
 */
export async function POST() {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    await connectDB()

    const deliveredPath = `deliveredAt.${userId}`
    const pending = await Conversation.find(
      {
        members: userId,
        'lastMessage.senderId': { $ne: userId },
        $or: [{ [deliveredPath]: { $exists: false } }, { $expr: { $lt: [`$${deliveredPath}`, '$lastMessageAt'] } }]
      },
      { members: 1 }
    )
      .limit(INBOX_LIMIT)
      .lean<Pick<ConversationDocument, '_id' | 'members'>[]>()

    if (pending.length === 0) return ok({ delivered: 0 })

    const deliveredAt = new Date()
    await Conversation.updateMany(
      { _id: { $in: pending.map((conversation) => conversation._id) } },
      { $set: { [deliveredPath]: deliveredAt } }
    )

    await Promise.all(
      pending.map((conversation) =>
        publishToUser(otherMemberId(conversation, userId), {
          type: 'chat:delivered',
          userId,
          deliveredAt: deliveredAt.toISOString()
        })
      )
    )

    return ok({ delivered: pending.length })
  } catch (error) {
    return serverError('chats/delivered:POST', error)
  }
}
