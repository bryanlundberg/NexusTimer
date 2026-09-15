export interface RealtimeMessage {
  _id: string
  senderId: string
  text: string
  createdAt: string
}

/** `userId` is always the other party, so the recipient knows what to refresh. */
export type RealtimeEvent =
  | { type: 'friend:request'; userId: string }
  | { type: 'friend:accepted'; userId: string }
  | { type: 'friend:removed'; userId: string }
  | { type: 'message:new'; userId: string; message: RealtimeMessage }
  | { type: 'chat:read'; userId: string }
  | { type: 'chat:delivered'; userId: string; deliveredAt: string }
  | { type: 'chat:seen'; userId: string; readAt: string }
  | { type: 'typing'; userId: string }

/** Frames the browser sends through the gateway (see services/realtime/internal/broker/relay.go). */
export type RealtimeClientFrame = { type: 'typing'; to: string }

export type RealtimeTicketResponse = { url: string; ticket: string }

export const userChannel = (userId: string) => `rt:user:${userId}`
