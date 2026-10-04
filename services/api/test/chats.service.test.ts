import { type PrivacySettings, resolvePrivacy } from '@nexustimer/contracts'
import { describe, expect, it } from 'vitest'
import { createRealtimePublisher } from '../src/infra/realtime'
import { pairKeyOf } from '../src/lib/pair-key'
import type { ChatsRepository, StoredConversation, StoredMessage } from '../src/modules/chats/chats.repository'
import { createChatsService, serializeMessage, toReceipts } from '../src/modules/chats/chats.service'
import { fakeRedis } from './fake-redis'
import { fakeUsers } from './social-fakes'

const T0 = Date.UTC(2026, 9, 4, 10, 0, 0)

type FakeChat = StoredConversation & { pairKey: string }
type FakeMessage = StoredMessage & { chatId: string; deletedFor: Set<string> }

function fakeChats() {
  const chats = new Map<string, FakeChat>()
  const messages = new Map<string, FakeMessage>()
  let seq = 0
  const nextId = () => String(++seq).padStart(24, '0')
  const at = (offset: number) => new Date(T0 + offset * 1000)
  const chatOf = (id: string) => chats.get(id)!

  const newest = (chatId: string) =>
    [...messages.values()].filter((message) => message.chatId === chatId).sort((a, b) => b.id.localeCompare(a.id))[0]

  const repository: ChatsRepository = {
    async findForMember(chatId, userId) {
      const chat = chats.get(chatId)
      return chat?.members.includes(userId) ? structuredClone(chat) : null
    },
    async inbox(userId) {
      return [...chats.values()].filter((chat) => chat.members.includes(userId) && chat.lastMessage)
    },
    async ensureDirect(userId, otherId) {
      const pairKey = pairKeyOf(userId, otherId)
      const existing = [...chats.values()].find((chat) => chat.pairKey === pairKey)
      if (existing) return structuredClone(existing)
      const chat: FakeChat = {
        id: nextId(),
        pairKey,
        members: [userId, otherId],
        unread: {},
        deliveredAt: {},
        readAt: {},
        clearedAt: {},
        muted: {}
      }
      chats.set(chat.id, chat)
      return structuredClone(chat)
    },
    async setMuted(chatId, userId, muted) {
      if (muted) chatOf(chatId).muted[userId] = true
      else delete chatOf(chatId).muted[userId]
    },
    async hide(chatId, userId, when) {
      chatOf(chatId).clearedAt[userId] = when
      chatOf(chatId).unread[userId] = 0
    },
    async clear(chatId, userId, when) {
      chatOf(chatId).clearedAt[userId] = when
      chatOf(chatId).unread[userId] = 0
    },
    async markRead(chatId, userId, when) {
      const chat = chatOf(chatId)
      if (!(chat.unread[userId]! > 0)) return false
      chat.unread[userId] = 0
      chat.readAt[userId] = when
      chat.deliveredAt[userId] = when
      return true
    },
    async pendingDelivery(userId) {
      return [...chats.values()]
        .filter((chat) => chat.members.includes(userId) && chat.lastMessage && chat.lastMessage.senderId !== userId)
        .filter((chat) => !chat.deliveredAt[userId] || chat.deliveredAt[userId]! < chat.lastMessage!.createdAt)
        .map(({ id, members }) => ({ id, members }))
    },
    async markDelivered(chatIds, userId, when) {
      for (const id of chatIds) chatOf(id).deliveredAt[userId] = when
    },
    async recordLastMessage(chatId, message, unreadFor) {
      const chat = chatOf(chatId)
      chat.lastMessage = {
        messageId: message.id,
        text: message.text,
        senderId: message.senderId,
        createdAt: message.createdAt
      }
      for (const memberId of unreadFor) chat.unread[memberId] = (chat.unread[memberId] ?? 0) + 1
    },
    async refreshLastMessage(chatId) {
      const message = newest(chatId)
      if (!message) return
      chatOf(chatId).lastMessage = {
        messageId: message.id,
        text: message.deletedAt ? '' : message.text,
        senderId: message.senderId,
        createdAt: message.createdAt
      }
    },
    async messagesPage(chatId, userId, { clearedAt, before, limit }) {
      return [...messages.values()]
        .filter((message) => message.chatId === chatId && !message.deletedFor.has(userId))
        .filter((message) => (!clearedAt || message.createdAt > clearedAt) && (!before || message.id < before))
        .sort((a, b) => b.id.localeCompare(a.id))
        .slice(0, limit)
        .map(({ chatId: _, deletedFor: __, ...message }) => structuredClone(message))
    },
    async hiddenMessageIds(messageIds, userId) {
      return new Set(messageIds.filter((id) => messages.get(id)?.deletedFor.has(userId)))
    },
    async findMessage(chatId, messageId) {
      const message = messages.get(messageId)
      if (!message || message.chatId !== chatId) return null
      const { chatId: _, deletedFor: __, ...stored } = message
      return structuredClone(stored)
    },
    async insertMessage(chatId, senderId, text) {
      const message: FakeMessage = {
        id: nextId(),
        chatId,
        senderId,
        text,
        createdAt: at(seq),
        reactions: [],
        deletedFor: new Set()
      }
      messages.set(message.id, message)
      const { chatId: _, deletedFor: __, ...stored } = message
      return structuredClone(stored)
    },
    async editMessage(messageId, text, when) {
      Object.assign(messages.get(messageId)!, { text, editedAt: when })
    },
    async hideMessageFor(messageId, userId) {
      messages.get(messageId)!.deletedFor.add(userId)
    },
    async deleteForEveryone(messageId, when) {
      const message = messages.get(messageId)!
      Object.assign(message, { text: '', deletedAt: when, reactions: [] })
      delete message.editedAt
    },
    async addReaction(messageId, userId, emoji) {
      messages.get(messageId)!.reactions.push({ userId, emoji })
    },
    async removeReaction(messageId, userId, emoji) {
      const message = messages.get(messageId)!
      message.reactions = message.reactions.filter((r) => !(r.userId === userId && r.emoji === emoji))
    },
    async reactions(messageId) {
      return structuredClone(messages.get(messageId)?.reactions ?? [])
    }
  }

  return { repository, chats, messages }
}

function setup({
  friends = [['ana', 'ben']],
  privacy = {}
}: { friends?: [string, string][]; privacy?: Record<string, Partial<PrivacySettings>> } = {}) {
  const redis = fakeRedis()
  const store = fakeChats()
  const pairs = new Set(friends.map(([a, b]) => pairKeyOf(a, b)))
  let clock = 0

  const service = createChatsService({
    repository: store.repository,
    social: { areFriends: async (userId, otherId) => pairs.has(pairKeyOf(userId, otherId)) },
    users: {
      ...fakeUsers(privacy),
      async privacyMap(ids) {
        return new Map(ids.map((id) => [id, resolvePrivacy(privacy[id])]))
      }
    },
    realtime: createRealtimePublisher(redis.provider),
    now: () => new Date(T0 + 3_600_000 + ++clock * 1000)
  })

  const events = () =>
    redis.published.splice(0).map(({ channel, message }) => [channel.replace('rt:user:', ''), JSON.parse(message)])

  async function openChat(userId = 'ana', otherId = 'ben') {
    const result = await service.open(userId, otherId)
    if (!('chat' in result)) throw new Error(result.error)
    return (await service.find(userId, result.chat._id))!
  }

  async function send(chat: StoredConversation, userId: string, text: string) {
    const result = await service.send(chat, userId, text)
    if (!('message' in result)) throw new Error(result.error)
    return result.message
  }

  const fresh = async (chat: StoredConversation, userId = chat.members[0]!) => (await service.find(userId, chat.id))!
  const stored = async (chat: StoredConversation, messageId: string) => (await service.findMessage(chat, messageId))!

  return { service, store, events, openChat, send, fresh, stored }
}

describe('chats service', () => {
  it('opens one conversation per pair, only between friends', async () => {
    const { service, store } = setup()

    const first = await service.open('ana', 'ben')
    const second = await service.open('ben', 'ana')

    expect(first).toEqual({
      chat: {
        _id: expect.any(String),
        user: { _id: 'ben', name: 'Ben', image: 'https://cdn.test/b.png' },
        unread: 0,
        receipts: { deliveredAt: null, readAt: null },
        muted: false
      }
    })
    expect('chat' in second && 'chat' in first && second.chat._id === first.chat._id).toBe(true)
    expect(store.chats.size).toBe(1)
    expect(await service.open('ana', 'cam')).toEqual({ error: 'not-friends' })
  })

  it('refuses a friend whose account is gone', async () => {
    const { service } = setup({ friends: [['ana', 'ghost']] })

    expect(await service.open('ana', 'ghost')).toEqual({ error: 'user-not-found' })
  })

  it('sends to friends, counts unread for the other member and tells both', async () => {
    const { service, openChat, send, fresh, events } = setup()
    const chat = await openChat()

    const message = await send(chat, 'ana', 'hola')

    expect(message).toEqual({ _id: expect.any(String), senderId: 'ana', text: 'hola', createdAt: expect.any(String) })
    expect((await fresh(chat)).unread).toEqual({ ben: 1 })
    expect(events()).toEqual([
      ['ana', { type: 'message:new', chatId: chat.id, message }],
      ['ben', { type: 'message:new', chatId: chat.id, message }]
    ])
  })

  it('stops sending once the friendship ends', async () => {
    const friends = setup()
    const chat = await friends.openChat()
    const strangers = setup({ friends: [] })

    expect(await strangers.service.send(chat, 'ana', 'hola')).toEqual({ error: 'not-friends' })
  })

  it('builds the inbox with previews, unread totals and receipts', async () => {
    const { service, store, openChat, send, events } = setup({
      friends: [
        ['ana', 'ben'],
        ['ana', 'cam'],
        ['ana', 'ghost']
      ],
      privacy: { cam: { readReceipts: false } }
    })
    const withBen = await openChat('ana', 'ben')
    const withCam = await openChat('ana', 'cam')
    const withGhost = await store.repository.ensureDirect('ana', 'ghost')
    await send(withBen, 'ben', 'one')
    await send(withBen, 'ben', 'two')
    const hidden = await send(withCam, 'cam', 'only for cam now')
    await send(withGhost, 'ghost', 'boo')
    store.messages.get(hidden._id)!.deletedFor.add('ana')
    store.chats.get(withBen.id)!.readAt.ben = new Date(T0 + 99_000)
    store.chats.get(withCam.id)!.readAt.cam = new Date(T0 + 99_000)
    events()

    const inbox = await service.inbox('ana')

    expect(inbox.totalUnread).toBe(3)
    expect(inbox.threads.map((thread) => [thread.user._id, thread.unread, thread.lastMessage?.text ?? null])).toEqual([
      ['ben', 2, 'two'],
      ['cam', 1, null]
    ])
    expect(inbox.threads[0]!.receipts.readAt).toBe(new Date(T0 + 99_000).toISOString())
    expect(inbox.threads[1]!.receipts.readAt).toBeNull()
  })

  it('hides previews older than my clear', async () => {
    const { service, openChat, send } = setup()
    const chat = await openChat()
    await send(chat, 'ben', 'old')

    await service.clear(chat, 'ana')

    expect((await service.inbox('ana')).threads[0]).toMatchObject({ unread: 0, lastMessage: null })
    expect((await service.inbox('ben')).threads[0]!.lastMessage).toMatchObject({ text: 'old' })
  })

  it('pages messages oldest first and reports when more remain', async () => {
    const { service, openChat, send } = setup()
    const chat = await openChat()
    const sent = []
    for (let i = 0; i < 32; i++) sent.push(await send(chat, i % 2 ? 'ben' : 'ana', `m${i}`))

    const first = await service.messages(chat, 'ana')
    const older = await service.messages(chat, 'ana', first.messages[0]!._id)

    expect(first.hasMore).toBe(true)
    expect(first.messages.map((message) => message.text)).toEqual(sent.slice(2).map((message) => message.text))
    expect(older).toMatchObject({ hasMore: false, messages: [{ text: 'm0' }, { text: 'm1' }] })
  })

  it('shows the read receipt only when both share them', async () => {
    const shared = setup()
    const sharedChat = await shared.openChat()
    shared.store.chats.get(sharedChat.id)!.readAt.ben = new Date(T0)
    shared.store.chats.get(sharedChat.id)!.deliveredAt.ben = new Date(T0)

    const withheld = setup({ privacy: { ana: { readReceipts: false } } })
    const privateChat = await withheld.openChat()
    withheld.store.chats.get(privateChat.id)!.readAt.ben = new Date(T0)
    withheld.store.chats.get(privateChat.id)!.deliveredAt.ben = new Date(T0)

    const iso = new Date(T0).toISOString()
    expect((await shared.service.messages(await shared.fresh(sharedChat), 'ana')).receipts).toEqual({
      deliveredAt: iso,
      readAt: iso
    })
    expect((await withheld.service.messages(await withheld.fresh(privateChat), 'ana')).receipts).toEqual({
      deliveredAt: iso,
      readAt: null
    })
  })

  it('marks a chat read and tells the sender seen or only delivered', async () => {
    const shared = setup()
    const chat = await shared.openChat()
    await shared.send(chat, 'ben', 'hola')
    shared.events()

    await shared.service.markRead(await shared.fresh(chat), 'ana')
    await shared.service.markRead(await shared.fresh(chat), 'ana')

    const [mine, theirs, ...rest] = shared.events()
    expect(mine).toEqual(['ana', { type: 'chat:read', chatId: chat.id }])
    expect(theirs).toEqual(['ben', { type: 'chat:seen', chatId: chat.id, readAt: expect.any(String) }])
    expect(rest).toEqual([])

    const quiet = setup({ privacy: { ben: { readReceipts: false } } })
    const quietChat = await quiet.openChat()
    await quiet.send(quietChat, 'ben', 'hola')
    quiet.events()
    await quiet.service.markRead(await quiet.fresh(quietChat), 'ana')

    expect(quiet.events()[1]).toEqual([
      'ben',
      { type: 'chat:delivered', chatId: quietChat.id, deliveredAt: expect.any(String) }
    ])
  })

  it('marks pending chats delivered once and tells the senders', async () => {
    const { service, openChat, send, events } = setup()
    const chat = await openChat()
    await send(chat, 'ben', 'hola')
    events()

    expect(await service.markDelivered('ana')).toBe(1)
    expect(events()).toEqual([['ben', { type: 'chat:delivered', chatId: chat.id, deliveredAt: expect.any(String) }]])
    expect(await service.markDelivered('ana')).toBe(0)
    expect(await service.markDelivered('ben')).toBe(0)
  })

  it('mutes, hides and clears for me only', async () => {
    const { service, openChat, fresh, events } = setup()
    const chat = await openChat()

    await service.setMuted(chat, 'ana', true)
    expect((await fresh(chat)).muted).toEqual({ ana: true })
    await service.setMuted(chat, 'ana', false)
    expect((await fresh(chat)).muted).toEqual({})
    await service.hide(chat, 'ana')
    await service.clear(chat, 'ana')

    expect(events()).toEqual([
      ['ana', { type: 'chat:muted', chatId: chat.id, muted: true }],
      ['ana', { type: 'chat:muted', chatId: chat.id, muted: false }],
      ['ana', { type: 'chat:removed', chatId: chat.id }],
      ['ana', { type: 'chat:cleared', chatId: chat.id }]
    ])
  })

  it('edits only my own live messages and refreshes the preview', async () => {
    const { service, openChat, send, stored, fresh, events } = setup()
    const chat = await openChat()
    const sent = await send(chat, 'ana', 'helo')
    events()

    expect(await service.edit(chat, 'ben', await stored(chat, sent._id), 'hacked')).toEqual({ error: 'not-sender' })
    expect(await service.edit(chat, 'ana', await stored(chat, sent._id), 'helo')).toEqual({ message: sent })
    expect(events()).toEqual([])

    const result = await service.edit(chat, 'ana', await stored(chat, sent._id), 'hello')

    expect(result).toEqual({ message: { ...sent, text: 'hello', editedAt: expect.any(String) } })
    expect((await fresh(chat)).lastMessage?.text).toBe('hello')
    expect(events().map(([to, event]) => [to, event.type])).toEqual([
      ['ana', 'message:edited'],
      ['ben', 'message:edited']
    ])

    await service.deleteMessage(chat, 'ana', await stored(chat, sent._id), 'all')
    expect(await service.edit(chat, 'ana', await stored(chat, sent._id), 'again')).toEqual({ error: 'deleted' })
  })

  it('deletes for me silently and for everyone only as the sender', async () => {
    const { service, openChat, send, stored, fresh, events } = setup()
    const chat = await openChat()
    const sent = await send(chat, 'ana', 'secret')
    events()

    expect(await service.deleteMessage(chat, 'ben', await stored(chat, sent._id), 'me')).toBe('deleted')
    expect(events()).toEqual([['ben', { type: 'message:deleted', chatId: chat.id, messageId: sent._id, scope: 'me' }]])
    expect((await service.messages(chat, 'ben')).messages).toEqual([])
    expect(await service.deleteMessage(chat, 'ben', await stored(chat, sent._id), 'all')).toBe('not-sender')

    expect(await service.deleteMessage(chat, 'ana', await stored(chat, sent._id), 'all')).toBe('deleted')
    expect((await fresh(chat)).lastMessage?.text).toBe('')
    expect((await service.messages(chat, 'ana')).messages).toEqual([
      { _id: sent._id, senderId: 'ana', text: '', createdAt: sent.createdAt, deletedAt: expect.any(String) }
    ])
    expect(events().map(([to, event]) => [to, event.scope])).toEqual([
      ['ana', 'all'],
      ['ben', 'all']
    ])
  })

  it('toggles reactions, caps them per user and refuses deleted messages', async () => {
    const { service, openChat, send, stored, events } = setup()
    const chat = await openChat()
    const sent = await send(chat, 'ana', 'nice')
    events()

    expect(await service.react(chat, 'ben', await stored(chat, sent._id), '👍')).toEqual({
      reactions: [{ userId: 'ben', emoji: '👍' }]
    })
    expect(events()[1]).toEqual([
      'ben',
      { type: 'message:reactions', chatId: chat.id, messageId: sent._id, reactions: [{ userId: 'ben', emoji: '👍' }] }
    ])
    expect(await service.react(chat, 'ben', await stored(chat, sent._id), '👍')).toEqual({ reactions: [] })

    for (const emoji of ['👍', '❤️', '😂', '😮', '😢', '🙏'])
      await service.react(chat, 'ben', await stored(chat, sent._id), emoji)
    expect(await service.react(chat, 'ben', await stored(chat, sent._id), '🔥')).toEqual({ error: 'too-many' })
    expect(await service.react(chat, 'ben', await stored(chat, sent._id), '🙏')).toEqual({
      reactions: expect.any(Array)
    })

    await service.deleteMessage(chat, 'ana', await stored(chat, sent._id), 'all')
    expect(await service.react(chat, 'ben', await stored(chat, sent._id), '👍')).toEqual({ error: 'deleted' })
  })
})

describe('serializeMessage and toReceipts', () => {
  it('blanks deleted messages and drops their reactions', () => {
    const message: StoredMessage = {
      id: 'm1',
      senderId: 'ana',
      text: 'still stored',
      createdAt: new Date(T0),
      editedAt: new Date(T0 + 1000),
      deletedAt: new Date(T0 + 2000),
      reactions: [{ userId: 'ben', emoji: '👍' }]
    }

    expect(serializeMessage(message)).toEqual({
      _id: 'm1',
      senderId: 'ana',
      text: '',
      createdAt: new Date(T0).toISOString(),
      editedAt: new Date(T0 + 1000).toISOString(),
      deletedAt: new Date(T0 + 2000).toISOString()
    })
  })

  it('reads the member entries and hides the read time when receipts are not shared', () => {
    const conversation = { deliveredAt: { u1: new Date(T0) }, readAt: { u1: new Date(T0) } }

    expect(toReceipts(conversation, 'u1', true)).toEqual({
      deliveredAt: new Date(T0).toISOString(),
      readAt: new Date(T0).toISOString()
    })
    expect(toReceipts(conversation, 'u1', false).readAt).toBeNull()
    expect(toReceipts({ deliveredAt: {}, readAt: {} }, 'u1', true)).toEqual({ deliveredAt: null, readAt: null })
  })
})
