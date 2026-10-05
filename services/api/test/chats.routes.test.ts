import { describe, expect, it, vi } from 'vitest'
import type { StoredConversation, StoredMessage } from '../src/modules/chats/chats.repository'
import type { ChatsService } from '../src/modules/chats/chats.service'
import { buildTestApp, testSessions } from './helpers'

const ME = '64b7f0c2a1b2c3d4e5f60718'
const OTHER = '64b7f0c2a1b2c3d4e5f60719'
const CHAT = '64b7f0c2a1b2c3d4e5f60720'
const MESSAGE = '64b7f0c2a1b2c3d4e5f60721'
const MISSING = '64b7f0c2a1b2c3d4e5f607ff'

const chat: StoredConversation = {
  id: CHAT,
  members: [ME, OTHER],
  unread: {},
  deliveredAt: {},
  readAt: {},
  clearedAt: {},
  muted: {}
}

const message: StoredMessage = {
  id: MESSAGE,
  senderId: ME,
  text: 'hola',
  createdAt: new Date('2026-10-04T10:00:00.000Z'),
  reactions: []
}

const serialized = { _id: MESSAGE, senderId: ME, text: 'hola', createdAt: '2026-10-04T10:00:00.000Z' }

const summary = {
  _id: CHAT,
  user: { _id: OTHER, name: 'Ben', image: '' },
  unread: 0,
  receipts: { deliveredAt: null, readAt: null },
  muted: false
}

const json = (method: string, body: unknown) => ({
  method,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body)
})

function appWith(overrides: Partial<ChatsService> = {}, userId: string | null = ME) {
  const unused = () => Promise.reject(new Error('not used'))
  return buildTestApp({
    sessions: testSessions(userId),
    chats: {
      inbox: unused,
      open: unused,
      find: async (_, chatId) => (chatId === CHAT ? chat : null),
      findMessage: async (_, messageId) => (messageId === MESSAGE ? message : null),
      summary: unused,
      setMuted: unused,
      hide: unused,
      markRead: unused,
      markDelivered: unused,
      messages: unused,
      send: unused,
      clear: unused,
      edit: unused,
      deleteMessage: unused,
      react: unused,
      ...overrides
    }
  })
}

const chatPath = `/api/v1/chats/${CHAT}`
const messagePath = `${chatPath}/messages/${MESSAGE}`

describe('chats routes', () => {
  it('answers 401 without a session', async () => {
    const app = appWith({}, null)

    for (const [path, init] of [
      ['/api/v1/chats', undefined],
      ['/api/v1/chats', json('POST', { userId: OTHER })],
      ['/api/v1/chats/delivered', { method: 'POST' }],
      [chatPath, undefined],
      [`${chatPath}/read`, { method: 'POST' }],
      [`${chatPath}/messages`, undefined],
      [messagePath, { method: 'DELETE' }],
      [`${messagePath}/reactions`, json('POST', { emoji: '👍' })]
    ] as const) {
      expect((await app.request(path, init)).status).toBe(401)
    }
  })

  it('returns the inbox and the delivered count', async () => {
    const app = appWith({
      inbox: async () => ({ threads: [], totalUnread: 0 }),
      markDelivered: async () => 2
    })

    expect(await (await app.request('/api/v1/chats')).json()).toEqual({ threads: [], totalUnread: 0 })
    expect(await (await app.request('/api/v1/chats/delivered', { method: 'POST' })).json()).toEqual({ delivered: 2 })
  })

  it('opens a chat with a friend and maps the refusals', async () => {
    const open = vi.fn<ChatsService['open']>(async (_, otherId) =>
      otherId === OTHER
        ? { chat: summary }
        : otherId === MISSING
          ? { error: 'user-not-found' }
          : { error: 'not-friends' }
    )
    const app = appWith({ open })

    const self = await app.request('/api/v1/chats', json('POST', { userId: ME }))
    const invalid = await app.request('/api/v1/chats', json('POST', { userId: 'nope' }))
    const opened = await app.request('/api/v1/chats', json('POST', { userId: OTHER }))
    const missing = await app.request('/api/v1/chats', json('POST', { userId: MISSING }))
    const stranger = await app.request('/api/v1/chats', json('POST', { userId: CHAT }))

    expect(self.status).toBe(400)
    expect(await self.json()).toEqual({ message: 'Cannot target yourself' })
    expect(invalid.status).toBe(400)
    expect(await opened.json()).toEqual(summary)
    expect(missing.status).toBe(404)
    expect(await missing.json()).toEqual({ message: 'User not found' })
    expect(stranger.status).toBe(403)
    expect(await stranger.json()).toEqual({ message: 'You can only message friends' })
  })

  it('checks the chat id, then membership, before reading the body', async () => {
    const setMuted = vi.fn<ChatsService['setMuted']>(async () => {})
    const app = appWith({ setMuted })

    const invalid = await app.request('/api/v1/chats/nope', json('PATCH', { muted: true }))
    const missing = await app.request(`/api/v1/chats/${MISSING}`, json('PATCH', { muted: 'yes' }))
    const badBody = await app.request(chatPath, json('PATCH', { muted: 'yes' }))
    const muted = await app.request(chatPath, json('PATCH', { muted: true }))

    expect(invalid.status).toBe(400)
    expect(await invalid.json()).toEqual({ message: 'Invalid chat id' })
    expect(missing.status).toBe(404)
    expect(await missing.json()).toEqual({ message: 'Chat not found' })
    expect(badBody.status).toBe(400)
    expect(await muted.json()).toEqual({ muted: true })
    expect(setMuted.mock.calls).toEqual([[chat, ME, true]])
  })

  it('returns the chat summary, or 404 when the other member is gone', async () => {
    const found = await appWith({ summary: async () => summary }).request(chatPath)
    const gone = await appWith({ summary: async () => null }).request(chatPath)

    expect(await found.json()).toEqual(summary)
    expect(gone.status).toBe(404)
    expect(await gone.json()).toEqual({ message: 'User not found' })
  })

  it('hides, clears and marks read', async () => {
    const hide = vi.fn<ChatsService['hide']>(async () => {})
    const clear = vi.fn<ChatsService['clear']>(async () => {})
    const markRead = vi.fn<ChatsService['markRead']>(async () => {})
    const app = appWith({ hide, clear, markRead })

    expect((await app.request(chatPath, { method: 'DELETE' })).status).toBe(204)
    expect((await app.request(`${chatPath}/messages`, { method: 'DELETE' })).status).toBe(204)
    expect(await (await app.request(`${chatPath}/read`, { method: 'POST' })).json()).toEqual({ unread: 0 })
    expect([hide.mock.calls, clear.mock.calls, markRead.mock.calls]).toEqual([[[chat, ME]], [[chat, ME]], [[chat, ME]]])
  })

  it('pages messages with a valid cursor only', async () => {
    const messages = vi.fn<ChatsService['messages']>(async () => ({
      messages: [serialized],
      hasMore: false,
      receipts: { deliveredAt: null, readAt: null }
    }))
    const app = appWith({ messages })

    const invalid = await app.request(`${chatPath}/messages?before=nope`)
    const page = await app.request(`${chatPath}/messages?before=${MESSAGE}`)
    await app.request(`${chatPath}/messages`)

    expect(invalid.status).toBe(400)
    expect(await invalid.json()).toMatchObject({ message: 'Invalid query' })
    expect(await page.json()).toEqual({
      messages: [serialized],
      hasMore: false,
      receipts: { deliveredAt: null, readAt: null }
    })
    expect(messages.mock.calls).toEqual([
      [chat, ME, MESSAGE],
      [chat, ME, undefined]
    ])
  })

  it('sends trimmed text within the limit and answers 201', async () => {
    const send = vi.fn<ChatsService['send']>(async (_, __, text) =>
      text === 'stranger' ? { error: 'not-friends' } : { message: { ...serialized, text } }
    )
    const app = appWith({ send })

    const empty = await app.request(`${chatPath}/messages`, json('POST', { text: '   ' }))
    const long = await app.request(`${chatPath}/messages`, json('POST', { text: 'x'.repeat(2001) }))
    const sent = await app.request(`${chatPath}/messages`, json('POST', { text: '  hola  ' }))
    const refused = await app.request(`${chatPath}/messages`, json('POST', { text: 'stranger' }))

    expect(empty.status).toBe(400)
    expect(long.status).toBe(400)
    expect(sent.status).toBe(201)
    expect(await sent.json()).toEqual(serialized)
    expect(refused.status).toBe(403)
    expect(await refused.json()).toEqual({ message: 'You can only message friends' })
  })

  it('checks the message id, then the message, before reading the body', async () => {
    const edit = vi.fn<ChatsService['edit']>(async () => ({ message: serialized }))
    const app = appWith({ edit })

    const missingChat = await app.request(`/api/v1/chats/${MISSING}/messages/nope`, json('PATCH', { text: 'x' }))
    const invalid = await app.request(`${chatPath}/messages/nope`, json('PATCH', { text: 'x' }))
    const missing = await app.request(`${chatPath}/messages/${MISSING}`, json('PATCH', { text: '' }))

    expect(missingChat.status).toBe(404)
    expect(await missingChat.json()).toEqual({ message: 'Chat not found' })
    expect(invalid.status).toBe(400)
    expect(await invalid.json()).toEqual({ message: 'Invalid message id' })
    expect(missing.status).toBe(404)
    expect(await missing.json()).toEqual({ message: 'Message not found' })
    expect(edit).not.toHaveBeenCalled()
  })

  it('maps edit refusals', async () => {
    const forError = (error: 'not-sender' | 'deleted') =>
      appWith({ edit: async () => ({ error }) }).request(messagePath, json('PATCH', { text: 'new' }))

    const notMine = await forError('not-sender')
    const deleted = await forError('deleted')

    expect(notMine.status).toBe(403)
    expect(await notMine.json()).toEqual({ message: 'You can only edit your own messages' })
    expect(deleted.status).toBe(403)
    expect(await deleted.json()).toEqual({ message: 'This message was deleted' })
  })

  it('deletes for me by default and maps the sender check', async () => {
    const deleteMessage = vi.fn<ChatsService['deleteMessage']>(async (_, __, ___, scope) =>
      scope === 'all' ? 'not-sender' : 'deleted'
    )
    const app = appWith({ deleteMessage })

    const forMe = await app.request(messagePath, { method: 'DELETE' })
    const invalid = await app.request(`${messagePath}?scope=them`, { method: 'DELETE' })
    const forAll = await app.request(`${messagePath}?scope=all`, { method: 'DELETE' })

    expect(forMe.status).toBe(204)
    expect(invalid.status).toBe(400)
    expect(forAll.status).toBe(403)
    expect(await forAll.json()).toEqual({ message: 'You can only delete your own messages for everyone' })
    expect(deleteMessage.mock.calls.map((call) => call[3])).toEqual(['me', 'all'])
  })

  it('accepts a single emoji reaction and maps the refusals', async () => {
    const react = vi.fn<ChatsService['react']>(async (_, __, ___, emoji) =>
      emoji === '🔥'
        ? { error: 'too-many' }
        : emoji === '💀'
          ? { error: 'deleted' }
          : { reactions: [{ userId: ME, emoji }] }
    )
    const app = appWith({ react })
    const post = (emoji: string) => app.request(`${messagePath}/reactions`, json('POST', { emoji }))

    const two = await post('👍👍')
    const word = await post('ok')
    const reacted = await post('👍')
    const tooMany = await post('🔥')
    const deleted = await post('💀')

    expect(two.status).toBe(400)
    expect(word.status).toBe(400)
    expect(await reacted.json()).toEqual({ reactions: [{ userId: ME, emoji: '👍' }] })
    expect(tooMany.status).toBe(400)
    expect(await tooMany.json()).toEqual({ message: 'Too many reactions on this message' })
    expect(deleted.status).toBe(403)
    expect(await deleted.json()).toEqual({ message: 'This message was deleted' })
  })

  it('answers 500 with the generic message when the service fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await appWith({ inbox: () => Promise.reject(new Error('boom')) }).request('/api/v1/chats')

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ message: 'Internal server error' })
  })
})
