import type { MessageReaction } from '@nexustimer/contracts'
import { Types } from 'mongoose'
import { pairKeyOf } from '../../lib/pair-key'
import { ConversationModel } from './conversation.model'
import { MessageModel } from './message.model'

export type StoredLastMessage = { messageId?: string; text: string; senderId: string; createdAt: Date }

export type StoredConversation = {
  id: string
  members: string[]
  lastMessage?: StoredLastMessage
  unread: Record<string, number>
  deliveredAt: Record<string, Date>
  readAt: Record<string, Date>
  clearedAt: Record<string, Date>
  muted: Record<string, boolean>
}

export type StoredMessage = {
  id: string
  senderId: string
  text: string
  createdAt: Date
  editedAt?: Date
  deletedAt?: Date
  reactions: MessageReaction[]
}

export type MessagesPageQuery = { clearedAt?: Date; before?: string; limit: number }

export type ChatsRepository = {
  findForMember(chatId: string, userId: string): Promise<StoredConversation | null>
  inbox(userId: string, limit: number): Promise<StoredConversation[]>
  ensureDirect(userId: string, otherId: string): Promise<StoredConversation>
  setMuted(chatId: string, userId: string, muted: boolean): Promise<void>
  hide(chatId: string, userId: string, at: Date): Promise<void>
  clear(chatId: string, userId: string, at: Date): Promise<void>
  markRead(chatId: string, userId: string, at: Date): Promise<boolean>
  pendingDelivery(userId: string, limit: number): Promise<Pick<StoredConversation, 'id' | 'members'>[]>
  markDelivered(chatIds: string[], userId: string, at: Date): Promise<void>
  recordLastMessage(chatId: string, message: StoredMessage, unreadFor: string[]): Promise<void>
  refreshLastMessage(chatId: string): Promise<void>
  messagesPage(chatId: string, userId: string, query: MessagesPageQuery): Promise<StoredMessage[]>
  hiddenMessageIds(messageIds: string[], userId: string): Promise<Set<string>>
  findMessage(chatId: string, messageId: string): Promise<StoredMessage | null>
  insertMessage(chatId: string, senderId: string, text: string): Promise<StoredMessage>
  editMessage(messageId: string, text: string, at: Date): Promise<void>
  hideMessageFor(messageId: string, userId: string): Promise<void>
  deleteForEveryone(messageId: string, at: Date): Promise<void>
  addReaction(messageId: string, userId: string, emoji: string, at: Date): Promise<void>
  removeReaction(messageId: string, userId: string, emoji: string): Promise<void>
  reactions(messageId: string): Promise<MessageReaction[]>
}

type RawConversation = {
  _id: Types.ObjectId
  members: Types.ObjectId[]
  lastMessage?: { messageId?: Types.ObjectId | null; text?: string; senderId: Types.ObjectId; createdAt: Date } | null
  unread?: Record<string, number> | null
  deliveredAt?: Record<string, Date> | null
  readAt?: Record<string, Date> | null
  clearedAt?: Record<string, Date> | null
  muted?: Record<string, boolean> | null
}

type RawReaction = { userId: Types.ObjectId; emoji: string }

type RawMessage = {
  _id: Types.ObjectId
  senderId: Types.ObjectId
  text?: string
  createdAt: Date
  editedAt?: Date | null
  deletedAt?: Date | null
  reactions?: RawReaction[] | null
}

const isDuplicateKeyError = (error: unknown) => (error as { code?: number } | null)?.code === 11000

const toReactions = (reactions: RawReaction[] | null | undefined): MessageReaction[] =>
  (reactions ?? []).map((reaction) => ({ userId: reaction.userId.toString(), emoji: reaction.emoji }))

function toConversation(doc: RawConversation): StoredConversation {
  const { lastMessage } = doc
  return {
    id: doc._id.toString(),
    members: doc.members.map((id) => id.toString()),
    ...(lastMessage
      ? {
          lastMessage: {
            ...(lastMessage.messageId ? { messageId: lastMessage.messageId.toString() } : {}),
            text: lastMessage.text ?? '',
            senderId: lastMessage.senderId.toString(),
            createdAt: lastMessage.createdAt
          }
        }
      : {}),
    unread: doc.unread ?? {},
    deliveredAt: doc.deliveredAt ?? {},
    readAt: doc.readAt ?? {},
    clearedAt: doc.clearedAt ?? {},
    muted: doc.muted ?? {}
  }
}

function toMessage(doc: RawMessage): StoredMessage {
  return {
    id: doc._id.toString(),
    senderId: doc.senderId.toString(),
    text: doc.text ?? '',
    createdAt: doc.createdAt,
    ...(doc.editedAt ? { editedAt: doc.editedAt } : {}),
    ...(doc.deletedAt ? { deletedAt: doc.deletedAt } : {}),
    reactions: toReactions(doc.reactions)
  }
}

const findByPair = (userId: string, otherId: string) =>
  ConversationModel.findOne({ pairKey: pairKeyOf(userId, otherId) }).lean<RawConversation>()

export const chatsRepository: ChatsRepository = {
  async findForMember(chatId, userId) {
    const doc = await ConversationModel.findOne({ _id: chatId, members: userId }).lean<RawConversation>()
    return doc ? toConversation(doc) : null
  },

  async inbox(userId, limit) {
    const docs = await ConversationModel.find({
      members: userId,
      lastMessageAt: { $exists: true },
      $or: [
        { [`hiddenAt.${userId}`]: { $exists: false } },
        { $expr: { $gt: ['$lastMessageAt', `$hiddenAt.${userId}`] } }
      ]
    })
      .sort({ lastMessageAt: -1 })
      .limit(limit)
      .lean<RawConversation[]>()
    return docs.map(toConversation)
  },

  async ensureDirect(userId, otherId) {
    const existing = await findByPair(userId, otherId)
    if (existing) return toConversation(existing)

    try {
      await ConversationModel.create({ pairKey: pairKeyOf(userId, otherId), members: [userId, otherId] })
    } catch (error) {
      if (!isDuplicateKeyError(error)) throw error
    }
    const doc = await findByPair(userId, otherId)
    if (!doc) throw new Error('Conversation missing right after it was created')
    return toConversation(doc)
  },

  async setMuted(chatId, userId, muted) {
    await ConversationModel.updateOne(
      { _id: chatId },
      muted ? { $set: { [`muted.${userId}`]: true } } : { $unset: { [`muted.${userId}`]: 1 } }
    )
  },

  async hide(chatId, userId, at) {
    await ConversationModel.updateOne(
      { _id: chatId },
      { $set: { [`clearedAt.${userId}`]: at, [`hiddenAt.${userId}`]: at, [`unread.${userId}`]: 0 } }
    )
  },

  async clear(chatId, userId, at) {
    await ConversationModel.updateOne(
      { _id: chatId },
      { $set: { [`clearedAt.${userId}`]: at, [`unread.${userId}`]: 0 } }
    )
  },

  async markRead(chatId, userId, at) {
    const result = await ConversationModel.updateOne(
      { _id: chatId, [`unread.${userId}`]: { $gt: 0 } },
      { $set: { [`unread.${userId}`]: 0, [`readAt.${userId}`]: at, [`deliveredAt.${userId}`]: at } }
    )
    return result.modifiedCount > 0
  },

  async pendingDelivery(userId, limit) {
    const deliveredPath = `deliveredAt.${userId}`
    const docs = await ConversationModel.find(
      {
        members: userId,
        'lastMessage.senderId': { $ne: userId },
        $or: [{ [deliveredPath]: { $exists: false } }, { $expr: { $lt: [`$${deliveredPath}`, '$lastMessageAt'] } }]
      },
      { members: 1 }
    )
      .limit(limit)
      .lean<Pick<RawConversation, '_id' | 'members'>[]>()
    return docs.map((doc) => ({ id: doc._id.toString(), members: doc.members.map((id) => id.toString()) }))
  },

  async markDelivered(chatIds, userId, at) {
    await ConversationModel.updateMany({ _id: { $in: chatIds } }, { $set: { [`deliveredAt.${userId}`]: at } })
  },

  async recordLastMessage(chatId, message, unreadFor) {
    await ConversationModel.updateOne(
      { _id: chatId },
      {
        $set: {
          lastMessage: {
            messageId: message.id,
            text: message.text,
            senderId: message.senderId,
            createdAt: message.createdAt
          },
          lastMessageAt: message.createdAt
        },
        $inc: Object.fromEntries(unreadFor.map((memberId) => [`unread.${memberId}`, 1]))
      }
    )
  },

  async refreshLastMessage(chatId) {
    const newest = await MessageModel.findOne({ conversationId: chatId }).sort({ _id: -1 }).lean<RawMessage>()
    if (!newest) return

    await ConversationModel.updateOne(
      { _id: chatId },
      {
        $set: {
          lastMessage: {
            messageId: newest._id,
            text: newest.deletedAt ? '' : (newest.text ?? ''),
            senderId: newest.senderId,
            createdAt: newest.createdAt
          },
          lastMessageAt: newest.createdAt
        }
      }
    )
  },

  async messagesPage(chatId, userId, { clearedAt, before, limit }) {
    const docs = await MessageModel.find({
      conversationId: chatId,
      ...(clearedAt && { createdAt: { $gt: clearedAt } }),
      deletedFor: { $ne: new Types.ObjectId(userId) },
      ...(before && { _id: { $lt: before } })
    })
      .sort({ _id: -1 })
      .limit(limit)
      .lean<RawMessage[]>()
    return docs.map(toMessage)
  },

  async hiddenMessageIds(messageIds, userId) {
    if (messageIds.length === 0) return new Set()
    const docs = await MessageModel.find({ _id: { $in: messageIds }, deletedFor: userId }, { _id: 1 }).lean<
      { _id: Types.ObjectId }[]
    >()
    return new Set(docs.map((doc) => doc._id.toString()))
  },

  async findMessage(chatId, messageId) {
    const doc = await MessageModel.findOne({ _id: messageId, conversationId: chatId }).lean<RawMessage>()
    return doc ? toMessage(doc) : null
  },

  async insertMessage(chatId, senderId, text) {
    const doc = await MessageModel.create({ conversationId: chatId, senderId, text })
    return toMessage(doc.toObject() as RawMessage)
  },

  async editMessage(messageId, text, at) {
    await MessageModel.updateOne({ _id: messageId }, { $set: { text, editedAt: at } })
  },

  async hideMessageFor(messageId, userId) {
    await MessageModel.updateOne({ _id: messageId }, { $addToSet: { deletedFor: userId } })
  },

  async deleteForEveryone(messageId, at) {
    await MessageModel.updateOne(
      { _id: messageId },
      { $set: { text: '', deletedAt: at }, $unset: { reactions: 1, editedAt: 1 } }
    )
  },

  async addReaction(messageId, userId, emoji, at) {
    await MessageModel.updateOne({ _id: messageId }, { $push: { reactions: { userId, emoji, createdAt: at } } })
  },

  async removeReaction(messageId, userId, emoji) {
    await MessageModel.updateOne({ _id: messageId }, { $pull: { reactions: { userId, emoji } } })
  },

  async reactions(messageId) {
    const doc = await MessageModel.findOne({ _id: messageId }, { reactions: 1 }).lean<Pick<RawMessage, 'reactions'>>()
    return toReactions(doc?.reactions)
  }
}
