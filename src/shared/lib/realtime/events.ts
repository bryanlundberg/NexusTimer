/** `userId` is always the other party, so the recipient knows what to refresh. */
export type RealtimeEvent =
  | { type: 'friend:request'; userId: string }
  | { type: 'friend:accepted'; userId: string }
  | { type: 'friend:removed'; userId: string }

export type RealtimeEventType = RealtimeEvent['type']

export type RealtimeTicketResponse = { url: string; ticket: string }

export const userChannel = (userId: string) => `rt:user:${userId}`
