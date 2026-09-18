export interface MessageReaction {
  userId: string
  emoji: string
}

export interface RealtimeMessage {
  _id: string
  senderId: string
  text: string
  createdAt: string
  editedAt?: string
  deletedAt?: string
  reactions?: MessageReaction[]
}

export type PresenceStatus = 'online' | 'away' | 'busy' | 'invisible'

export const PRESENCE_STATUSES: PresenceStatus[] = ['online', 'away', 'busy', 'invisible']

export const isPresenceStatus = (value: unknown): value is PresenceStatus =>
  typeof value === 'string' && PRESENCE_STATUSES.includes(value as PresenceStatus)

export type PresenceDisplay = 'online' | 'away' | 'busy' | 'offline'

export interface PresenceUser {
  userId: string
  state: PresenceDisplay
  lastSeen?: number
}

export type RealtimeEvent =
  | { type: 'friend:request'; userId: string }
  | { type: 'friend:accepted'; userId: string }
  | { type: 'friend:removed'; userId: string }
  | { type: 'message:new'; chatId: string; message: RealtimeMessage }
  | { type: 'message:edited'; chatId: string; message: RealtimeMessage }
  | { type: 'message:deleted'; chatId: string; messageId: string; scope: 'me' | 'all' }
  | { type: 'message:reactions'; chatId: string; messageId: string; reactions: MessageReaction[] }
  | { type: 'chat:read'; chatId: string }
  | { type: 'chat:cleared'; chatId: string }
  | { type: 'chat:removed'; chatId: string }
  | { type: 'chat:muted'; chatId: string; muted: boolean }
  | { type: 'chat:delivered'; chatId: string; deliveredAt: string }
  | { type: 'chat:seen'; chatId: string; readAt: string }
  | { type: 'typing'; chatId: string; userId: string }
  | { type: 'presence'; users: PresenceUser[] }
  | { type: 'presence:self'; status: PresenceStatus }

export type RealtimeClientFrame =
  | { type: 'typing'; to: string; chatId: string }
  | { type: 'presence:watch'; ids: string[] }
  | { type: 'presence:idle'; idle: boolean }

export type RealtimeTicketResponse = { url: string; ticket: string }

export const userChannel = (userId: string) => `rt:user:${userId}`

export const presenceChannel = (userId: string) => `rt:presence:${userId}`
