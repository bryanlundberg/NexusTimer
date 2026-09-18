import useSWR from 'swr'
import { fetcher } from '@/shared/lib/fetcher'
import type { ChatSummary } from '@/entities/chat/model/types'
import { chatKey } from '@/entities/chat/model/useInbox'

export const useChat = (chatId: string) => {
  const { data, isLoading } = useSWR<ChatSummary>(chatId ? chatKey(chatId) : null, fetcher)

  return { chat: data, peer: data?.user, isLoading }
}
