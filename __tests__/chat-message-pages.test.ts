import { clearMessages, flattenPages, patchMessage, removeMessage } from '@/entities/chat/lib/message-pages'
import { NO_RECEIPTS, type ChatMessage, type MessagesPage } from '@/entities/chat/model/types'

const message = (id: string, extra: Partial<ChatMessage> = {}): ChatMessage => ({
  _id: id,
  senderId: 'me',
  text: `text ${id}`,
  createdAt: '2026-09-15T10:00:00.000Z',
  ...extra
})

/** Index 0 is the newest page, so an older page sits after it. */
const pages = (): MessagesPage[] => [
  { messages: [message('c'), message('d')], hasMore: true, receipts: NO_RECEIPTS },
  { messages: [message('a'), message('b')], hasMore: false, receipts: NO_RECEIPTS }
]

describe('patchMessage', () => {
  it('merges fields into the matching message and leaves the rest alone', () => {
    const result = patchMessage(pages(), 'a', { text: 'edited', editedAt: '2026-09-15T11:00:00.000Z' })

    expect(result[1].messages[0]).toMatchObject({ _id: 'a', text: 'edited', editedAt: '2026-09-15T11:00:00.000Z' })
    expect(result[1].messages[1]).toEqual(message('b'))
    expect(result[0].messages).toEqual(pages()[0].messages)
  })

  it('reaches messages on the newest page too', () => {
    const result = patchMessage(pages(), 'd', { reactions: [{ userId: 'me', emoji: '👍' }] })
    expect(result[0].messages[1].reactions).toEqual([{ userId: 'me', emoji: '👍' }])
  })

  it('turns a message into a tombstone without touching its id or timestamp', () => {
    const result = patchMessage(pages(), 'c', {
      text: '',
      deletedAt: '2026-09-15T12:00:00.000Z',
      reactions: undefined
    })

    expect(result[0].messages[0]).toMatchObject({
      _id: 'c',
      text: '',
      deletedAt: '2026-09-15T12:00:00.000Z',
      createdAt: '2026-09-15T10:00:00.000Z'
    })
  })

  it('is a no-op when the id is not there', () => {
    expect(patchMessage(pages(), 'missing', { text: 'x' })).toEqual(pages())
  })

  it('survives an empty cache', () => {
    expect(patchMessage(undefined, 'a', { text: 'x' })).toEqual([])
  })
})

describe('removeMessage', () => {
  it('drops only the matching message', () => {
    const result = removeMessage(pages(), 'b')
    expect(flattenPages(result).map((item) => item._id)).toEqual(['a', 'c', 'd'])
  })
})

describe('clearMessages', () => {
  it('collapses every page into a single empty one that cannot page back', () => {
    const result = clearMessages(pages())

    expect(result).toHaveLength(1)
    expect(result[0].messages).toEqual([])
    expect(result[0].hasMore).toBe(false)
  })

  it('keeps the receipts so the checks on our own messages do not flicker', () => {
    const receipts = { deliveredAt: '2026-09-15T10:05:00.000Z', readAt: null }
    const result = clearMessages([{ messages: [message('a')], hasMore: true, receipts }])

    expect(result[0].receipts).toEqual(receipts)
  })

  it('survives an empty cache', () => {
    expect(clearMessages(undefined)).toEqual([{ messages: [], hasMore: false, receipts: NO_RECEIPTS }])
  })
})
