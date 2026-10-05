import {
  type ChatMessagesPage,
  type ChatSummary,
  type ChatThread,
  type DeleteScope,
  type FriendUser,
  INBOX_LIMIT,
  type InboxResponse,
  MAX_REACTIONS_PER_USER,
  type MessageReaction,
  MESSAGES_PAGE_SIZE,
  type PrivacySettings,
  type RealtimeMessage,
  type Receipts
} from '@nexustimer/contracts'
import type { RealtimePublisher } from '../../infra/realtime'
import type { SocialService } from '../social/social.service'
import type { UsersService } from '../users/users.service'
import type { ChatsRepository, StoredConversation, StoredMessage } from './chats.repository'

export type OpenChatResult = { chat: ChatSummary } | { error: 'not-friends' | 'user-not-found' }
export type SendResult = { message: RealtimeMessage } | { error: 'not-friends' }
export type EditResult = { message: RealtimeMessage } | { error: 'not-sender' | 'deleted' }
export type DeleteMessageResult = 'deleted' | 'not-sender'
export type ReactResult = { reactions: MessageReaction[] } | { error: 'deleted' | 'too-many' }

export type ChatsService = {
  inbox(userId: string): Promise<InboxResponse>
  open(userId: string, otherId: string): Promise<OpenChatResult>
  find(userId: string, chatId: string): Promise<StoredConversation | null>
  findMessage(chat: StoredConversation, messageId: string): Promise<StoredMessage | null>
  summary(chat: StoredConversation, userId: string): Promise<ChatSummary | null>
  setMuted(chat: StoredConversation, userId: string, muted: boolean): Promise<void>
  hide(chat: StoredConversation, userId: string): Promise<void>
  markRead(chat: StoredConversation, userId: string): Promise<void>
  markDelivered(userId: string): Promise<number>
  messages(chat: StoredConversation, userId: string, before?: string): Promise<ChatMessagesPage>
  send(chat: StoredConversation, userId: string, text: string): Promise<SendResult>
  clear(chat: StoredConversation, userId: string): Promise<void>
  edit(chat: StoredConversation, userId: string, message: StoredMessage, text: string): Promise<EditResult>
  deleteMessage(
    chat: StoredConversation,
    userId: string,
    message: StoredMessage,
    scope: DeleteScope
  ): Promise<DeleteMessageResult>
  react(chat: StoredConversation, userId: string, message: StoredMessage, emoji: string): Promise<ReactResult>
}

type ChatsDeps = {
  repository: ChatsRepository
  social: Pick<SocialService, 'areFriends'>
  users: Pick<UsersService, 'friendUsers' | 'privacyMap'>
  realtime: Pick<RealtimePublisher, 'toUser' | 'toUsers'>
  now?: () => Date
}

export function serializeMessage(message: StoredMessage): RealtimeMessage {
  const serialized: RealtimeMessage = {
    _id: message.id,
    senderId: message.senderId,
    text: message.deletedAt ? '' : message.text,
    createdAt: message.createdAt.toISOString()
  }

  if (message.editedAt) serialized.editedAt = message.editedAt.toISOString()
  if (message.deletedAt) serialized.deletedAt = message.deletedAt.toISOString()
  if (!message.deletedAt && message.reactions.length) serialized.reactions = message.reactions

  return serialized
}

export function toReceipts(
  conversation: Pick<StoredConversation, 'deliveredAt' | 'readAt'>,
  memberId: string,
  showRead: boolean
): Receipts {
  return {
    deliveredAt: conversation.deliveredAt[memberId]?.toISOString() ?? null,
    readAt: (showRead && conversation.readAt[memberId]?.toISOString()) || null
  }
}

export const otherMemberId = (chat: Pick<StoredConversation, 'members'>, userId: string) =>
  chat.members.find((id) => id !== userId) ?? chat.members[0]!

const sharesReadReceipts = (privacy: Map<string, PrivacySettings>, userId: string, otherId: string) =>
  !!privacy.get(userId)?.readReceipts && !!privacy.get(otherId)?.readReceipts

function toSummary(chat: StoredConversation, user: FriendUser, userId: string, showRead: boolean): ChatSummary {
  return {
    _id: chat.id,
    user,
    unread: chat.unread[userId] ?? 0,
    receipts: toReceipts(chat, user._id, showRead),
    muted: !!chat.muted[userId]
  }
}

export function createChatsService({
  repository,
  social,
  users,
  realtime,
  now = () => new Date()
}: ChatsDeps): ChatsService {
  async function readReceiptsShared(userId: string, otherId: string) {
    return sharesReadReceipts(await users.privacyMap([userId, otherId]), userId, otherId)
  }

  return {
    async inbox(userId) {
      const conversations = await repository.inbox(userId, INBOX_LIMIT)
      const peerIds = conversations.map((chat) => otherMemberId(chat, userId))
      const previewIds = conversations.flatMap((chat) => chat.lastMessage?.messageId ?? [])

      const [profiles, hiddenPreviews, privacy] = await Promise.all([
        users.friendUsers(peerIds),
        repository.hiddenMessageIds(previewIds, userId),
        users.privacyMap([userId, ...peerIds])
      ])

      const threads: ChatThread[] = []
      for (const chat of conversations) {
        const user = profiles.get(otherMemberId(chat, userId))
        if (!user) continue

        const { lastMessage } = chat
        const clearedAt = chat.clearedAt[userId]
        const visible =
          !!lastMessage &&
          !(clearedAt && lastMessage.createdAt <= clearedAt) &&
          !(lastMessage.messageId && hiddenPreviews.has(lastMessage.messageId))

        threads.push({
          ...toSummary(chat, user, userId, sharesReadReceipts(privacy, userId, user._id)),
          lastMessage:
            visible && lastMessage
              ? {
                  senderId: lastMessage.senderId,
                  text: lastMessage.text,
                  createdAt: lastMessage.createdAt.toISOString()
                }
              : null
        })
      }

      return { threads, totalUnread: threads.reduce((total, thread) => total + thread.unread, 0) }
    },

    async open(userId, otherId) {
      if (!(await social.areFriends(userId, otherId))) return { error: 'not-friends' }

      const user = (await users.friendUsers([otherId])).get(otherId)
      if (!user) return { error: 'user-not-found' }

      const chat = await repository.ensureDirect(userId, otherId)
      return { chat: toSummary(chat, user, userId, await readReceiptsShared(userId, otherId)) }
    },

    find: (userId, chatId) => repository.findForMember(chatId, userId),

    findMessage: (chat, messageId) => repository.findMessage(chat.id, messageId),

    async summary(chat, userId) {
      const otherId = otherMemberId(chat, userId)
      const [profiles, showRead] = await Promise.all([
        users.friendUsers([otherId]),
        readReceiptsShared(userId, otherId)
      ])
      const user = profiles.get(otherId)
      return user ? toSummary(chat, user, userId, showRead) : null
    },

    async setMuted(chat, userId, muted) {
      await repository.setMuted(chat.id, userId, muted)
      await realtime.toUser(userId, { type: 'chat:muted', chatId: chat.id, muted })
    },

    async hide(chat, userId) {
      await repository.hide(chat.id, userId, now())
      await realtime.toUser(userId, { type: 'chat:removed', chatId: chat.id })
    },

    async markRead(chat, userId) {
      const readAt = now()
      if (!(await repository.markRead(chat.id, userId, readAt))) return

      const otherId = otherMemberId(chat, userId)
      const at = readAt.toISOString()
      await Promise.all([
        realtime.toUser(userId, { type: 'chat:read', chatId: chat.id }),
        (await readReceiptsShared(userId, otherId))
          ? realtime.toUser(otherId, { type: 'chat:seen', chatId: chat.id, readAt: at })
          : realtime.toUser(otherId, { type: 'chat:delivered', chatId: chat.id, deliveredAt: at })
      ])
    },

    async markDelivered(userId) {
      const pending = await repository.pendingDelivery(userId, INBOX_LIMIT)
      if (pending.length === 0) return 0

      const deliveredAt = now()
      await repository.markDelivered(
        pending.map((chat) => chat.id),
        userId,
        deliveredAt
      )

      await Promise.all(
        pending.map((chat) =>
          realtime.toUsers(
            chat.members.filter((memberId) => memberId !== userId),
            { type: 'chat:delivered', chatId: chat.id, deliveredAt: deliveredAt.toISOString() }
          )
        )
      )
      return pending.length
    },

    async messages(chat, userId, before) {
      const docs = await repository.messagesPage(chat.id, userId, {
        clearedAt: chat.clearedAt[userId],
        before,
        limit: MESSAGES_PAGE_SIZE + 1
      })

      const otherId = otherMemberId(chat, userId)
      return {
        messages: docs.slice(0, MESSAGES_PAGE_SIZE).reverse().map(serializeMessage),
        hasMore: docs.length > MESSAGES_PAGE_SIZE,
        receipts: toReceipts(chat, otherId, await readReceiptsShared(userId, otherId))
      }
    },

    async send(chat, userId, text) {
      if (!(await social.areFriends(userId, otherMemberId(chat, userId)))) return { error: 'not-friends' }

      const stored = await repository.insertMessage(chat.id, userId, text)
      await repository.recordLastMessage(
        chat.id,
        stored,
        chat.members.filter((memberId) => memberId !== userId)
      )

      const message = serializeMessage(stored)
      await realtime.toUsers(chat.members, { type: 'message:new', chatId: chat.id, message })
      return { message }
    },

    async clear(chat, userId) {
      await repository.clear(chat.id, userId, now())
      await realtime.toUser(userId, { type: 'chat:cleared', chatId: chat.id })
    },

    async edit(chat, userId, message, text) {
      if (message.senderId !== userId) return { error: 'not-sender' }
      if (message.deletedAt) return { error: 'deleted' }
      if (text === message.text) return { message: serializeMessage(message) }

      const editedAt = now()
      await repository.editMessage(message.id, text, editedAt)
      await repository.refreshLastMessage(chat.id)

      const updated = serializeMessage({ ...message, text, editedAt })
      await realtime.toUsers(chat.members, { type: 'message:edited', chatId: chat.id, message: updated })
      return { message: updated }
    },

    async deleteMessage(chat, userId, message, scope) {
      if (scope === 'me') {
        await repository.hideMessageFor(message.id, userId)
        await realtime.toUser(userId, { type: 'message:deleted', chatId: chat.id, messageId: message.id, scope: 'me' })
        return 'deleted'
      }

      if (message.senderId !== userId) return 'not-sender'

      if (!message.deletedAt) {
        await repository.deleteForEveryone(message.id, now())
        await repository.refreshLastMessage(chat.id)
      }

      await realtime.toUsers(chat.members, {
        type: 'message:deleted',
        chatId: chat.id,
        messageId: message.id,
        scope: 'all'
      })
      return 'deleted'
    },

    async react(chat, userId, message, emoji) {
      if (message.deletedAt) return { error: 'deleted' }

      const mine = message.reactions.filter((reaction) => reaction.userId === userId)
      if (mine.some((reaction) => reaction.emoji === emoji)) {
        await repository.removeReaction(message.id, userId, emoji)
      } else {
        if (mine.length >= MAX_REACTIONS_PER_USER) return { error: 'too-many' }
        await repository.addReaction(message.id, userId, emoji, now())
      }

      const reactions = await repository.reactions(message.id)
      await realtime.toUsers(chat.members, {
        type: 'message:reactions',
        chatId: chat.id,
        messageId: message.id,
        reactions
      })
      return { reactions }
    }
  }
}
