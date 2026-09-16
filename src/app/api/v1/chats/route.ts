import connectDB from '@/shared/config/mongodb/mongodb'
import Conversation, { type ConversationDocument } from '@/entities/chat/model/conversation'
import { otherMemberId } from '@/entities/chat/server/chat'
import { INBOX_LIMIT, type ChatThread, type InboxResponse } from '@/entities/chat/model/types'
import { toReceipts } from '@/entities/chat/lib/message-status'
import { findFriendUsers } from '@/entities/friendship/server/friends'
import { requireUser } from '@/shared/api/require-user'
import { ok, serverError } from '@/shared/api/responses'

export async function GET() {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    await connectDB()

    const conversations = await Conversation.find({ members: userId, lastMessageAt: { $exists: true } })
      .sort({ lastMessageAt: -1 })
      .limit(INBOX_LIMIT)
      .lean<ConversationDocument[]>()
    const users = await findFriendUsers(conversations.map((conversation) => otherMemberId(conversation, userId)))

    const threads: ChatThread[] = []
    for (const conversation of conversations) {
      const user = users.get(otherMemberId(conversation, userId))
      if (!user) continue // account deleted

      const { lastMessage } = conversation
      threads.push({
        user,
        unread: conversation.unread?.[userId] ?? 0,
        receipts: toReceipts(conversation, user._id),
        lastMessage: lastMessage
          ? {
              senderId: lastMessage.senderId.toString(),
              text: lastMessage.text,
              createdAt: lastMessage.createdAt.toISOString()
            }
          : null
      })
    }

    const response: InboxResponse = {
      threads,
      totalUnread: threads.reduce((total, thread) => total + thread.unread, 0)
    }
    return ok(response)
  } catch (error) {
    return serverError('chats:GET', error)
  }
}
