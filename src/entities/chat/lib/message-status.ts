import type { ChatMessage, Receipts } from '@/entities/chat/model/types'

export type MessageStatus = 'sending' | 'failed' | 'sent' | 'delivered' | 'read'

const reached = (timestamp: string | null, createdAt: string) =>
  !!timestamp && Date.parse(timestamp) >= Date.parse(createdAt)

export function messageStatus(
  message: Pick<ChatMessage, 'createdAt' | 'pending' | 'failed'>,
  receipts: Receipts
): MessageStatus {
  if (message.failed) return 'failed'
  if (message.pending) return 'sending'
  if (reached(receipts.readAt, message.createdAt)) return 'read'
  if (reached(receipts.deliveredAt, message.createdAt)) return 'delivered'
  return 'sent'
}

export function mergeReceipts(a: Receipts, b: Partial<Receipts>): Receipts {
  const latest = (x: string | null, y: string | null | undefined) => (!y || (x && x >= y) ? x : y)
  return { deliveredAt: latest(a.deliveredAt, b.deliveredAt), readAt: latest(a.readAt, b.readAt) }
}

export function toReceipts(
  conversation: { deliveredAt?: Record<string, Date>; readAt?: Record<string, Date> },
  memberId: string,
  showRead = true
): Receipts {
  return {
    deliveredAt: conversation.deliveredAt?.[memberId]?.toISOString() ?? null,
    readAt: (showRead && conversation.readAt?.[memberId]?.toISOString()) || null
  }
}
