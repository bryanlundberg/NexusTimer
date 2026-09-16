import { NextRequest } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import Conversation from '@/entities/chat/model/conversation'
import { requireUserPair, type UserIdParams } from '@/shared/api/require-user-pair'
import { ok, serverError } from '@/shared/api/responses'
import { publishToUser } from '@/shared/lib/realtime/publish'
import { pairKeyOf } from '@/shared/lib/pair-key'

export async function POST(_request: NextRequest, context: UserIdParams) {
  try {
    const ids = await requireUserPair(context)
    if (ids instanceof Response) return ids
    const { userId, otherId } = ids

    await connectDB()

    const readAt = new Date()
    const result = await Conversation.updateOne(
      { pairKey: pairKeyOf(userId, otherId), [`unread.${userId}`]: { $gt: 0 } },
      // Reading implies the messages were delivered
      { $set: { [`unread.${userId}`]: 0, [`readAt.${userId}`]: readAt, [`deliveredAt.${userId}`]: readAt } }
    )

    if (result.modifiedCount > 0) {
      await Promise.all([
        // Clears the unread badge on the reader's other tabs and devices
        publishToUser(userId, { type: 'chat:read', userId: otherId }),
        publishToUser(otherId, { type: 'chat:seen', userId, readAt: readAt.toISOString() })
      ])
    }

    return ok({ unread: 0 })
  } catch (error) {
    return serverError('chats/[userId]/read:POST', error)
  }
}
