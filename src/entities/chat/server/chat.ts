import type { Types } from 'mongoose'
import Conversation, { type ConversationDocument } from '@/entities/chat/model/conversation'
import type { MessageDocument } from '@/entities/chat/model/message'
import type { RealtimeMessage } from '@/shared/lib/realtime/events'
import { isDuplicateKeyError } from '@/shared/api/mongo-errors'
import { pairKeyOf } from '@/shared/lib/pair-key'

type IdOnly = Pick<ConversationDocument, '_id'>

export function serializeMessage(
  doc: Pick<MessageDocument, '_id' | 'senderId' | 'text' | 'createdAt'>
): RealtimeMessage {
  return {
    _id: doc._id.toString(),
    senderId: doc.senderId.toString(),
    text: doc.text,
    createdAt: doc.createdAt.toISOString()
  }
}

export function findConversationId(userId: string, otherId: string) {
  return Conversation.findOne({ pairKey: pairKeyOf(userId, otherId) }, { _id: 1 }).lean<IdOnly>()
}

export function findConversationReceipts(userId: string, otherId: string) {
  return Conversation.findOne({ pairKey: pairKeyOf(userId, otherId) }, { _id: 1, deliveredAt: 1, readAt: 1 }).lean<
    Pick<ConversationDocument, '_id' | 'deliveredAt' | 'readAt'>
  >()
}

export async function ensureConversationId(userId: string, otherId: string): Promise<Types.ObjectId> {
  const existing = await findConversationId(userId, otherId)
  if (existing) return existing._id

  try {
    const created = await Conversation.create({ pairKey: pairKeyOf(userId, otherId), members: [userId, otherId] })
    return created._id
  } catch (error) {
    // Both users sent their first message at the same moment
    if (!isDuplicateKeyError(error)) throw error
    const winner = await findConversationId(userId, otherId)
    if (!winner) throw error
    return winner._id
  }
}

export function otherMemberId(conversation: Pick<ConversationDocument, 'members'>, userId: string): string {
  const other = conversation.members.find((id) => id.toString() !== userId)
  return (other ?? conversation.members[0]).toString()
}
