import { Types } from 'mongoose'
import Conversation, { type ConversationDocument } from '@/entities/chat/model/conversation'
import Message, { type MessageDocument } from '@/entities/chat/model/message'
import type { ChatSummary } from '@/entities/chat/model/types'
import { toReceipts } from '@/entities/chat/lib/message-status'
import type { FriendUser } from '@/entities/friendship/model/types'
import type { RealtimeMessage } from '@/shared/lib/realtime/events'
import { isDuplicateKeyError } from '@/shared/api/mongo-errors'
import { pairKeyOf } from '@/shared/lib/pair-key'

type IdOnly = Pick<ConversationDocument, '_id'>

type SerializableMessage = Pick<MessageDocument, '_id' | 'senderId' | 'text' | 'createdAt'> &
  Partial<Pick<MessageDocument, 'editedAt' | 'deletedAt' | 'reactions'>>

export function serializeMessage(doc: SerializableMessage): RealtimeMessage {
  const message: RealtimeMessage = {
    _id: doc._id.toString(),
    senderId: doc.senderId.toString(),
    text: doc.deletedAt ? '' : doc.text,
    createdAt: doc.createdAt.toISOString()
  }

  if (doc.editedAt) message.editedAt = doc.editedAt.toISOString()
  if (doc.deletedAt) message.deletedAt = doc.deletedAt.toISOString()
  // Reactions disappear with the message they were attached to
  if (!doc.deletedAt && doc.reactions?.length) {
    message.reactions = doc.reactions.map((reaction) => ({
      userId: reaction.userId.toString(),
      emoji: reaction.emoji
    }))
  }

  return message
}

/**
 * What one member is allowed to see: everything after they last emptied the chat,
 * minus the messages they deleted only for themselves.
 */
export function visibleMessagesFilter(
  conversationId: Types.ObjectId,
  userId: string,
  conversation: Pick<ConversationDocument, 'clearedAt'>
) {
  const clearedAt = conversation.clearedAt?.[userId]
  return {
    conversationId,
    ...(clearedAt && { createdAt: { $gt: clearedAt } }),
    deletedFor: { $ne: new Types.ObjectId(userId) }
  }
}

/**
 * Rewrites the denormalized inbox preview from the newest message. Editing or deleting
 * is rare, so recomputing beats tracking whether the touched message was the last one.
 */
export async function refreshLastMessage(conversationId: Types.ObjectId): Promise<void> {
  const newest = await Message.findOne({ conversationId }).sort({ _id: -1 }).lean<MessageDocument>()
  if (!newest) return

  await Conversation.updateOne(
    { _id: conversationId },
    {
      $set: {
        lastMessage: {
          messageId: newest._id,
          text: newest.deletedAt ? '' : newest.text,
          senderId: newest.senderId,
          createdAt: newest.createdAt
        },
        lastMessageAt: newest.createdAt
      }
    }
  )
}

const findDirectId = (userId: string, otherId: string) =>
  Conversation.findOne({ pairKey: pairKeyOf(userId, otherId) }, { _id: 1 }).lean<IdOnly>()

export async function ensureConversationId(userId: string, otherId: string): Promise<Types.ObjectId> {
  const existing = await findDirectId(userId, otherId)
  if (existing) return existing._id

  try {
    const created = await Conversation.create({ pairKey: pairKeyOf(userId, otherId), members: [userId, otherId] })
    return created._id
  } catch (error) {
    // Both users opened the chat at the same moment
    if (!isDuplicateKeyError(error)) throw error
    const winner = await findDirectId(userId, otherId)
    if (!winner) throw error
    return winner._id
  }
}

export const memberIds = (conversation: Pick<ConversationDocument, 'members'>): string[] =>
  conversation.members.map((id) => id.toString())

export function otherMemberId(conversation: Pick<ConversationDocument, 'members'>, userId: string): string {
  const other = conversation.members.find((id) => id.toString() !== userId)
  return (other ?? conversation.members[0]).toString()
}

type SummarizableConversation = Pick<ConversationDocument, '_id' | 'members' | 'unread' | 'deliveredAt' | 'readAt'>

export function toChatSummary(conversation: SummarizableConversation, user: FriendUser, userId: string): ChatSummary {
  return {
    _id: conversation._id.toString(),
    user,
    unread: conversation.unread?.[userId] ?? 0,
    receipts: toReceipts(conversation, user._id)
  }
}
