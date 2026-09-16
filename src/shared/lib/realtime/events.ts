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
  /** Deleted for everyone: `text` comes back empty and the UI shows a tombstone. */
  deletedAt?: string
  reactions?: MessageReaction[]
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
  | { type: 'chat:delivered'; chatId: string; deliveredAt: string }
  | { type: 'chat:seen'; chatId: string; readAt: string }
  | { type: 'typing'; chatId: string; userId: string }

export type RealtimeClientFrame = { type: 'typing'; to: string; chatId: string }

export type RealtimeTicketResponse = { url: string; ticket: string }

export const userChannel = (userId: string) => `rt:user:${userId}`
