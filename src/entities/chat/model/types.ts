import type { FriendUser } from '@/entities/friendship/model/types'
import type { RealtimeMessage } from '@/shared/lib/realtime/events'

export const MAX_MESSAGE_LENGTH = 2000
export const MESSAGES_PAGE_SIZE = 30
export const INBOX_LIMIT = 50

/** Enough for a ZWJ sequence with a skin tone, and short enough to reject pasted text. */
export const MAX_REACTION_LENGTH = 32
export const MAX_REACTIONS_PER_USER = 6

export type DeleteScope = 'me' | 'all'

export interface ChatMessage extends RealtimeMessage {
  pending?: boolean
  failed?: boolean
}

export type { MessageReaction } from '@/shared/lib/realtime/events'

export type ChatPeer = Pick<FriendUser, '_id' | 'name' | 'image'>

export interface Receipts {
  deliveredAt: string | null
  readAt: string | null
}

export const NO_RECEIPTS: Receipts = { deliveredAt: null, readAt: null }

export interface ChatSummary {
  _id: string
  user: FriendUser
  unread: number
  receipts: Receipts
}

export interface ChatThread extends ChatSummary {
  lastMessage: Omit<RealtimeMessage, '_id'> | null
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
