import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSWRConfig } from 'swr'
import useSWRInfinite from 'swr/infinite'
import { fetcher } from '@/shared/lib/fetcher'
import { apiPost } from '@/shared/api/client'
import { NO_RECEIPTS, type ChatMessage, type MessagesPage, type Receipts } from '@/entities/chat/model/types'
import { INBOX_KEY, messagesKey, readKey, useInbox } from '@/entities/chat/model/useInbox'
import {
  appendMessage,
  confirmMessage,
  failMessage,
  flattenPages,
  removeMessage
} from '@/entities/chat/lib/message-pages'
import { mergeReceipts } from '@/entities/chat/lib/message-status'
import { useRealtimeEvent } from '@/features/realtime/model/useRealtimeEvent'
import { sendRealtime } from '@/features/realtime/model/realtime-bus'
import { TYPING_TTL_MS, useTypingUsers } from '@/features/chat/model/typing-store'

// Resent well before the receiver's indicator expires, so it stays on while typing
const TYPING_SEND_INTERVAL_MS = TYPING_TTL_MS - 1500

export function useConversation(userId: string) {
  const { data: session } = useSession()
  const myId = session?.user?.id
  const enabled = !!myId && !!userId && myId !== userId
  const { mutate: mutateGlobal } = useSWRConfig()

  const getKey = (index: number, previous: MessagesPage | null) => {
    if (!enabled) return null
    if (index === 0) return messagesKey(userId)
    if (!previous?.hasMore || previous.messages.length === 0) return null
    return `${messagesKey(userId)}?before=${previous.messages[0]._id}`
  }

  const { data, mutate, size, setSize, isLoading } = useSWRInfinite<MessagesPage>(getKey, fetcher, {
    // Refetching the newest page while loading older ones would drop optimistic messages
    revalidateFirstPage: false
  })

  const update = (change: (pages?: MessagesPage[]) => MessagesPage[]) => mutate(change, { revalidate: false })

  const lastTypingSentAt = useRef(0)
  const [liveReceipts, setLiveReceipts] = useState<Receipts>(NO_RECEIPTS)
  const isOtherTyping = useTypingUsers().has(userId)

  const deliver = async (text: string) => {
    lastTypingSentAt.current = 0
    const temp: ChatMessage = {
      _id: `temp-${crypto.randomUUID()}`,
      senderId: myId ?? '',
      text,
      createdAt: new Date().toISOString(),
      pending: true
    }
    await update((pages) => appendMessage(pages, temp))

    try {
      const saved = await apiPost<ChatMessage>(messagesKey(userId), { text })
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

  const notifyTyping = () => {
    const now = Date.now()
    if (!enabled || now - lastTypingSentAt.current < TYPING_SEND_INTERVAL_MS) return
    if (sendRealtime({ type: 'typing', to: userId })) lastTypingSentAt.current = now
  }

  useRealtimeEvent((event) => {
    if (!enabled) return
    if (event.type === 'message:new' && event.userId === userId) {
      void update((pages) => appendMessage(pages, event.message))
    } else if (event.type === 'chat:delivered' && event.userId === userId) {
      setLiveReceipts((current) => mergeReceipts(current, { deliveredAt: event.deliveredAt }))
    } else if (event.type === 'chat:seen' && event.userId === userId) {
      setLiveReceipts((current) => mergeReceipts(current, { readAt: event.readAt }))
    } else if (event.type === 'realtime:reconnected') {
      void mutate()
    }
  })

  const { data: inbox } = useInbox()
  const unread = inbox?.threads.find((thread) => thread.user._id === userId)?.unread ?? 0

  useEffect(() => {
    if (!enabled || unread === 0) return

    const markRead = () => {
      if (document.visibilityState !== 'visible') return
      apiPost(readKey(userId), {})
        .then(() => mutateGlobal(INBOX_KEY))
        .catch(() => {})
    }

    markRead()
    document.addEventListener('visibilitychange', markRead)
    return () => document.removeEventListener('visibilitychange', markRead)
  }, [enabled, unread, userId, mutateGlobal])

  const messages = flattenPages(data)

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
    notifyTyping
  }
}
