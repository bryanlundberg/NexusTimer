import {
  appendMessage,
  confirmMessage,
  failMessage,
  flattenPages,
  removeMessage
} from '@/entities/chat/lib/message-pages'
import { NO_RECEIPTS, type ChatMessage, type MessagesPage } from '@/entities/chat/model/types'

const msg = (id: string, extra: Partial<ChatMessage> = {}): ChatMessage => ({
  _id: id,
  senderId: 'me',
  text: id,
  createdAt: '2026-09-15T00:00:00.000Z',
  ...extra
})

const ids = (pages: MessagesPage[]) => flattenPages(pages).map((m) => m._id)

describe('message pages', () => {
  const pages: MessagesPage[] = [
    { messages: [msg('c'), msg('d')], hasMore: true, receipts: NO_RECEIPTS },
    { messages: [msg('a'), msg('b')], hasMore: false, receipts: NO_RECEIPTS }
  ]

  it('flattens newest-first pages into chronological order', () => {
    expect(ids(pages)).toEqual(['a', 'b', 'c', 'd'])
    expect(flattenPages(undefined)).toEqual([])
  })

  it('appends to the newest page', () => {
    expect(ids(appendMessage(pages, msg('e')))).toEqual(['a', 'b', 'c', 'd', 'e'])
  })

  it('creates the first page when nothing is loaded yet', () => {
    expect(appendMessage(undefined, msg('a'))).toEqual([
      { messages: [msg('a')], hasMore: false, receipts: NO_RECEIPTS }
    ])
  })

  it('ignores a message that is already present', () => {
    expect(appendMessage(pages, msg('d'))).toBe(pages)
  })

  it('replaces the optimistic message with the saved one', () => {
    const withTemp = appendMessage(pages, msg('temp-1', { pending: true }))
    const confirmed = confirmMessage(withTemp, 'temp-1', msg('e'))
    expect(ids(confirmed)).toEqual(['a', 'b', 'c', 'd', 'e'])
    expect(flattenPages(confirmed).at(-1)?.pending).toBeUndefined()
  })

  it('drops the optimistic copy when the realtime event arrived first', () => {
    const withTemp = appendMessage(pages, msg('temp-1', { pending: true }))
    const echoed = appendMessage(withTemp, msg('e'))
    expect(ids(confirmMessage(echoed, 'temp-1', msg('e')))).toEqual(['a', 'b', 'c', 'd', 'e'])
  })

  it('adds the saved message when a revalidation dropped the optimistic copy', () => {
    expect(ids(confirmMessage(pages, 'temp-1', msg('e')))).toEqual(['a', 'b', 'c', 'd', 'e'])
  })

  it('marks a failed send and removes it for retry', () => {
    const withTemp = appendMessage(pages, msg('temp-1', { pending: true }))
    const failed = flattenPages(failMessage(withTemp, 'temp-1')).at(-1)
    expect(failed).toMatchObject({ pending: false, failed: true })
    expect(ids(removeMessage(withTemp, 'temp-1'))).toEqual(['a', 'b', 'c', 'd'])
  })
})
