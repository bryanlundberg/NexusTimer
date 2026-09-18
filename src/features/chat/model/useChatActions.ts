'use client'

import { useSWRConfig } from 'swr'
import { apiDelete } from '@/shared/api/client'
import { INBOX_KEY, chatKey, messagesKey } from '@/entities/chat/model/useInbox'

export function useChatActions(chatId: string) {
  const { mutate } = useSWRConfig()

  const revalidate = async () => {
    // useSWRInfinite stores its pages under a generated key that embeds the url
    await mutate((key) => typeof key === 'string' && key.includes(messagesKey(chatId)))
    await mutate(INBOX_KEY)
  }

  return {
    clearChat: async () => {
      await apiDelete(messagesKey(chatId))
      await revalidate()
    },
    deleteChat: async () => {
      await apiDelete(chatKey(chatId))
      await revalidate()
    }
  }
}
