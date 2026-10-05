import { z } from 'zod'
import { objectIdSchema } from './common'
import type { MessageReaction, RealtimeMessage } from './realtime'
import type { FriendUser } from './social'

export const MAX_MESSAGE_LENGTH = 2000
export const MESSAGES_PAGE_SIZE = 30
export const INBOX_LIMIT = 50

export const MAX_REACTION_LENGTH = 32
export const MAX_REACTIONS_PER_USER = 6

const MAX_BIG_EMOJI = 3

const EMOJI_ONLY =
  /^(?:\p{Extended_Pictographic}(?:\p{Emoji_Modifier}|️|‍\p{Extended_Pictographic}️?)*|\p{Regional_Indicator}{2})+$/u

const EMOJI_UNIT =
  /\p{Extended_Pictographic}(?:\p{Emoji_Modifier}|️|‍\p{Extended_Pictographic}️?)*|\p{Regional_Indicator}{2}/gu

export function isBigEmoji(text: string): boolean {
  const compact = text.replace(/\s+/g, '')
  if (!compact || !EMOJI_ONLY.test(compact)) return false
  return (compact.match(EMOJI_UNIT)?.length ?? 0) <= MAX_BIG_EMOJI
}

export function isSingleEmoji(text: string): boolean {
  if (!EMOJI_ONLY.test(text)) return false
  return (text.match(EMOJI_UNIT)?.length ?? 0) === 1
}

export const DELETE_SCOPES = ['me', 'all'] as const

export type DeleteScope = (typeof DELETE_SCOPES)[number]

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
  muted: boolean
}

export interface ChatThread extends ChatSummary {
  lastMessage: Omit<RealtimeMessage, '_id'> | null
}

export interface InboxResponse {
  threads: ChatThread[]
  totalUnread: number
}

export interface ChatMessagesPage {
  messages: RealtimeMessage[]
  hasMore: boolean
  receipts: Receipts
}

export type ChatMutedResponse = { muted: boolean }

export type ChatReadResponse = { unread: 0 }

export type ChatsDeliveredResponse = { delivered: number }

export type MessageReactionsResponse = { reactions: MessageReaction[] }

export const chatMuteSchema = z.object({ muted: z.boolean() }).strict()

export const messageTextSchema = z.object({ text: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH) }).strict()

export const chatMessagesQuerySchema = z.object({ before: objectIdSchema.optional() })

export const deleteMessageQuerySchema = z.object({ scope: z.enum(DELETE_SCOPES).default('me') })

export const messageReactionSchema = z
  .object({ emoji: z.string().max(MAX_REACTION_LENGTH).refine(isSingleEmoji, 'Not a single emoji') })
  .strict()
