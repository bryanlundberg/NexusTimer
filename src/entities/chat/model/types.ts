import type { FriendUser } from '@/entities/friendship/model/types'
import type { RealtimeMessage } from '@/shared/lib/realtime/events'

export const MAX_MESSAGE_LENGTH = 2000
export const MESSAGES_PAGE_SIZE = 30
export const INBOX_LIMIT = 50

export interface ChatMessage extends RealtimeMessage {
  /** Optimistic message not confirmed by the server yet. */
  pending?: boolean
  failed?: boolean
}

export type ChatPeer = Pick<FriendUser, '_id' | 'name' | 'image'>

/** The other member's receipts, which decide the checks on our messages. */
export interface Receipts {
  deliveredAt: string | null
  readAt: string | null
}

export const NO_RECEIPTS: Receipts = { deliveredAt: null, readAt: null }

export interface ChatThread {
  user: FriendUser
  lastMessage: Omit<RealtimeMessage, '_id'> | null
  unread: number
  receipts: Receipts
}

export interface InboxResponse {
  threads: ChatThread[]
  totalUnread: number
}

export interface MessagesPage {
  messages: ChatMessage[]
  hasMore: boolean
  receipts: Receipts
}
