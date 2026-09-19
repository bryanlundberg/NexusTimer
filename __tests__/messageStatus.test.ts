import { mergeReceipts, messageStatus, toReceipts } from '@/entities/chat/lib/message-status'
import { NO_RECEIPTS } from '@/entities/chat/model/types'

const sentAt = '2026-09-15T10:00:00.000Z'
const before = '2026-09-15T09:59:59.000Z'
const after = '2026-09-15T10:00:05.000Z'

describe('messageStatus', () => {
  it('shows a clock while sending and an alert when it failed', () => {
    expect(messageStatus({ createdAt: sentAt, pending: true }, NO_RECEIPTS)).toBe('sending')
    expect(messageStatus({ createdAt: sentAt, failed: true }, { deliveredAt: after, readAt: after })).toBe('failed')
  })

  it('is sent until the other app acknowledges it', () => {
    expect(messageStatus({ createdAt: sentAt }, NO_RECEIPTS)).toBe('sent')
    expect(messageStatus({ createdAt: sentAt }, { deliveredAt: before, readAt: null })).toBe('sent')
  })

  it('is delivered once the other app received it', () => {
    expect(messageStatus({ createdAt: sentAt }, { deliveredAt: after, readAt: before })).toBe('delivered')
    expect(messageStatus({ createdAt: sentAt }, { deliveredAt: sentAt, readAt: null })).toBe('delivered')
  })

  it('is read once the other member opened the conversation', () => {
    expect(messageStatus({ createdAt: sentAt }, { deliveredAt: null, readAt: after })).toBe('read')
  })
})

describe('mergeReceipts', () => {
  it('keeps the latest value of each receipt', () => {
    expect(mergeReceipts({ deliveredAt: after, readAt: before }, { deliveredAt: before, readAt: after })).toEqual({
      deliveredAt: after,
      readAt: after
    })
  })

  it('ignores missing values', () => {
    expect(mergeReceipts({ deliveredAt: after, readAt: null }, {})).toEqual({ deliveredAt: after, readAt: null })
  })
})

describe('toReceipts', () => {
  it('reads the member entries from the conversation maps', () => {
    const conversation = { deliveredAt: { u1: new Date(after) }, readAt: {} }
    expect(toReceipts(conversation, 'u1')).toEqual({ deliveredAt: after, readAt: null })
    expect(toReceipts({}, 'u1')).toEqual(NO_RECEIPTS)
  })
})
