import connectDB from '@/shared/config/mongodb/mongodb'
import Conversation, { type ConversationDocument } from '@/entities/chat/model/conversation'
import Message, { type MessageDocument } from '@/entities/chat/model/message'
import { otherMemberId } from '@/entities/chat/server/chat'
import { INBOX_LIMIT, type ChatThread, type InboxResponse } from '@/entities/chat/model/types'
import { toReceipts } from '@/entities/chat/lib/message-status'
import { findFriendUsers } from '@/entities/friendship/server/friends'
import { requireUser } from '@/shared/api/require-user'
import { ok, serverError } from '@/shared/api/responses'

/** Ids of the previewed messages this member deleted just for themselves. */
async function findHiddenPreviews(conversations: ConversationDocument[], userId: string): Promise<Set<string>> {
  const ids = conversations.map((conversation) => conversation.lastMessage?.messageId).filter(Boolean)
  if (ids.length === 0) return new Set()

  const docs = await Message.find({ _id: { $in: ids }, deletedFor: userId }, { _id: 1 }).lean<
    Pick<MessageDocument, '_id'>[]
  >()
  return new Set(docs.map((doc) => doc._id.toString()))
}

export async function GET() {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    await connectDB()

    const conversations = await Conversation.find({
      members: userId,
      lastMessageAt: { $exists: true },
      // A chat deleted on this side stays out until something newer arrives
      $or: [
        { [`hiddenAt.${userId}`]: { $exists: false } },
        { $expr: { $gt: ['$lastMessageAt', `$hiddenAt.${userId}`] } }
      ]
    })
      .sort({ lastMessageAt: -1 })
      .limit(INBOX_LIMIT)
      .lean<ConversationDocument[]>()

    const [users, hiddenPreviews] = await Promise.all([
      findFriendUsers(conversations.map((conversation) => otherMemberId(conversation, userId))),
      findHiddenPreviews(conversations, userId)
    ])

    const threads: ChatThread[] = []
    for (const conversation of conversations) {
      const user = users.get(otherMemberId(conversation, userId))
      if (!user) continue // account deleted

      const { lastMessage } = conversation
      const clearedAt = conversation.clearedAt?.[userId]
      const visible =
        !!lastMessage &&
        !(clearedAt && lastMessage.createdAt <= clearedAt) &&
        !(lastMessage.messageId && hiddenPreviews.has(lastMessage.messageId.toString()))

      threads.push({
        user,
        unread: conversation.unread?.[userId] ?? 0,
        receipts: toReceipts(conversation, user._id),
        lastMessage:
          visible && lastMessage
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
