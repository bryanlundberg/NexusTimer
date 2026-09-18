import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSWRConfig } from 'swr'
import useSWRInfinite from 'swr/infinite'
import { fetcher } from '@/shared/lib/fetcher'
import { playSound } from '@/shared/lib/play-sound'
import { apiDelete, apiPatch, apiPost } from '@/shared/api/client'
import {
  NO_RECEIPTS,
  type ChatMessage,
  type DeleteScope,
  type MessageReaction,
  type MessagesPage,
  type Receipts
} from '@/entities/chat/model/types'
import { INBOX_KEY, messageKey, messagesKey, reactionsKey, readKey, useInbox } from '@/entities/chat/model/useInbox'
import {
  appendMessage,
  clearMessages,
  confirmMessage,
  failMessage,
  flattenPages,
  patchMessage,
  receiveMessage,
  removeMessage
} from '@/entities/chat/lib/message-pages'
import { mergeReceipts } from '@/entities/chat/lib/message-status'
import { useRealtimeEvent } from '@/features/realtime/model/useRealtimeEvent'
import { sendRealtime } from '@/features/realtime/model/realtime-bus'
import { TYPING_TTL_MS, useTypingChats } from '@/features/chat/model/typing-store'

const TYPING_SEND_INTERVAL_MS = TYPING_TTL_MS - 1500

export function useConversation(chatId: string, peerId?: string) {
  const { data: session } = useSession()
  const myId = session?.user?.id
  const enabled = !!myId && !!chatId
  const { mutate: mutateGlobal } = useSWRConfig()

  const getKey = (index: number, previous: MessagesPage | null) => {
    if (!enabled) return null
    if (index === 0) return messagesKey(chatId)
    if (!previous?.hasMore || previous.messages.length === 0) return null
    return `${messagesKey(chatId)}?before=${previous.messages[0]._id}`
  }

  const { data, mutate, size, setSize, isLoading } = useSWRInfinite<MessagesPage>(getKey, fetcher, {
    // Refetching the newest page while loading older ones would drop optimistic messages
    revalidateFirstPage: false
  })

  const update = (change: (pages?: MessagesPage[]) => MessagesPage[]) => mutate(change, { revalidate: false })

  const messages = flattenPages(data)
  const lastTypingSentAt = useRef(0)
  const [liveReceipts, setLiveReceipts] = useState<Receipts>(NO_RECEIPTS)
  const isOtherTyping = useTypingChats().has(chatId)

  const deliver = async (text: string) => {
    lastTypingSentAt.current = 0
    playSound('messageSent')
    const temp: ChatMessage = {
      _id: `temp-${crypto.randomUUID()}`,
      senderId: myId ?? '',
      text,
      createdAt: new Date().toISOString(),
      pending: true
    }
    await update((pages) => appendMessage(pages, temp))

    try {
      const saved = await apiPost<ChatMessage>(messagesKey(chatId), { text })
      await update((pages) => confirmMessage(pages, temp._id, saved))
      void mutateGlobal(INBOX_KEY)
    } catch {
      await update((pages) => failMessage(pages, temp._id))
    }
  }

  const send = (text: string) => {
    const trimmed = text.trim()
    if (enabled && trimmed) void deliver(trimmed)
  }

  const retry = async (message: ChatMessage) => {
    await update((pages) => removeMessage(pages, message._id))
    await deliver(message.text)
  }

  const editMessage = async (messageId: string, text: string) => {
    const trimmed = text.trim()
    if (!enabled || !trimmed) return

    await update((pages) => patchMessage(pages, messageId, { text: trimmed, editedAt: new Date().toISOString() }))
    try {
      const saved = await apiPatch<ChatMessage>(messageKey(chatId, messageId), { text: trimmed })
      await update((pages) => patchMessage(pages, messageId, saved))
    } catch {
      void mutate()
    }
  }

  const tombstone = () => ({ text: '', deletedAt: new Date().toISOString(), reactions: undefined })

  const deleteMessage = async (messageId: string, scope: DeleteScope) => {
    if (!enabled) return

    await update((pages) =>
      scope === 'me' ? removeMessage(pages, messageId) : patchMessage(pages, messageId, tombstone())
    )
    try {
      await apiDelete(`${messageKey(chatId, messageId)}?scope=${scope}`)
    } catch {
      void mutate()
    }
  }

  const toggleReaction = async (messageId: string, emoji: string) => {
    if (!enabled || !myId) return

    const current = messages.find((message) => message._id === messageId)?.reactions ?? []
    const mine = (reaction: MessageReaction) => reaction.userId === myId && reaction.emoji === emoji
    const next = current.some(mine)
      ? current.filter((reaction) => !mine(reaction))
      : [...current, { userId: myId, emoji }]

    await update((pages) => patchMessage(pages, messageId, { reactions: next }))
    try {
      const saved = await apiPost<{ reactions: MessageReaction[] }>(reactionsKey(chatId, messageId), { emoji })
      await update((pages) => patchMessage(pages, messageId, { reactions: saved.reactions }))
    } catch {
      void mutate()
    }
  }

  const notifyTyping = () => {
    const now = Date.now()
    if (!enabled || !peerId || now - lastTypingSentAt.current < TYPING_SEND_INTERVAL_MS) return
    if (sendRealtime({ type: 'typing', to: peerId, chatId })) lastTypingSentAt.current = now
  }

  useRealtimeEvent((event) => {
    if (!enabled) return
    if (event.type === 'message:new' && event.chatId === chatId) {
      void update((pages) => receiveMessage(pages, event.message, myId))
    } else if (event.type === 'message:edited' && event.chatId === chatId) {
      void update((pages) => patchMessage(pages, event.message._id, event.message))
    } else if (event.type === 'message:deleted' && event.chatId === chatId) {
      void update((pages) =>
        event.scope === 'me' ? removeMessage(pages, event.messageId) : patchMessage(pages, event.messageId, tombstone())
      )
    } else if (event.type === 'message:reactions' && event.chatId === chatId) {
      void update((pages) => patchMessage(pages, event.messageId, { reactions: event.reactions }))
    } else if ((event.type === 'chat:cleared' || event.type === 'chat:removed') && event.chatId === chatId) {
      void update(clearMessages)
    } else if (event.type === 'chat:delivered' && event.chatId === chatId) {
      setLiveReceipts((current) => mergeReceipts(current, { deliveredAt: event.deliveredAt }))
    } else if (event.type === 'chat:seen' && event.chatId === chatId) {
      setLiveReceipts((current) => mergeReceipts(current, { readAt: event.readAt }))
    } else if (event.type === 'realtime:reconnected') {
      void mutate()
    }
  })

  const { data: inbox } = useInbox()
  const unread = inbox?.threads.find((thread) => thread._id === chatId)?.unread ?? 0

  useEffect(() => {
    if (!enabled || unread === 0) return

    const markRead = () => {
      if (document.visibilityState !== 'visible') return
      apiPost(readKey(chatId), {})
        .then(() => mutateGlobal(INBOX_KEY))
        .catch(() => {})
    }

    markRead()
    document.addEventListener('visibilitychange', markRead)
    return () => document.removeEventListener('visibilitychange', markRead)
  }, [enabled, unread, chatId, mutateGlobal])

  return {
    myId,
    messages,
    hasMore: data?.at(-1)?.hasMore ?? false,
    isLoading,
    isLoadingOlder: !!data && data.length < size,
    receipts: mergeReceipts(data?.[0]?.receipts ?? NO_RECEIPTS, liveReceipts),
    isOtherTyping,
    loadOlder: () => setSize(size + 1),
    send,
    retry,
    editMessage,
    deleteMessage,
    toggleReaction,
    notifyTyping
  }
}
