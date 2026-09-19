import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { fetcher } from '@/shared/lib/fetcher'
import type { InboxResponse } from '@/entities/chat/model/types'

export const INBOX_KEY = '/api/v1/chats'
export const chatKey = (chatId: string) => `${INBOX_KEY}/${chatId}`
export const messagesKey = (chatId: string) => `${chatKey(chatId)}/messages`
export const messageKey = (chatId: string, messageId: string) => `${messagesKey(chatId)}/${messageId}`
export const reactionsKey = (chatId: string, messageId: string) => `${messageKey(chatId, messageId)}/reactions`
export const readKey = (chatId: string) => `${chatKey(chatId)}/read`
export const DELIVERED_KEY = `${INBOX_KEY}/delivered`

export const useInbox = () => {
  const { data: session } = useSession()
  const { data, error, isLoading, mutate } = useSWR<InboxResponse>(session?.user?.id ? INBOX_KEY : null, fetcher)

  return { data, isLoading, isError: error, mutate }
}
