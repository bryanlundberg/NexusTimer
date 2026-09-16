'use client'

import { useSWRConfig } from 'swr'
import { apiDelete } from '@/shared/api/client'
import { INBOX_KEY, chatKey, messagesKey } from '@/entities/chat/model/useInbox'

/**
 * Conversation-wide actions, both one-sided: the other member keeps their history.
 * Kept out of `useConversation` so the header can use them without a second subscription.
 */
export function useChatActions(userId: string) {
  const { mutate } = useSWRConfig()

  const revalidate = async () => {
    // useSWRInfinite stores its pages under a generated key that embeds the url
    await mutate((key) => typeof key === 'string' && key.includes(messagesKey(userId)))
    await mutate(INBOX_KEY)
  }

  return {
    /** Empties the history here and leaves the thread in the inbox. */
    clearChat: async () => {
      await apiDelete(messagesKey(userId))
      await revalidate()
    },
    /** Empties it and drops the thread until a new message arrives. */
    deleteChat: async () => {
      await apiDelete(chatKey(userId))
      await revalidate()
    }
  }
}
