import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { fetcher } from '@/shared/lib/fetcher'
import type { InboxResponse } from '@/entities/chat/model/types'

export const INBOX_KEY = '/api/v1/chats'
export const chatKey = (userId: string) => `${INBOX_KEY}/${userId}`
export const messagesKey = (userId: string) => `${INBOX_KEY}/${userId}/messages`
export const messageKey = (userId: string, messageId: string) => `${messagesKey(userId)}/${messageId}`
export const reactionsKey = (userId: string, messageId: string) => `${messageKey(userId, messageId)}/reactions`
export const readKey = (userId: string) => `${INBOX_KEY}/${userId}/read`
export const DELIVERED_KEY = `${INBOX_KEY}/delivered`

export const useInbox = () => {
  const { data: session } = useSession()
  const { data, error, isLoading, mutate } = useSWR<InboxResponse>(session?.user?.id ? INBOX_KEY : null, fetcher)

  return { data, isLoading, isError: error, mutate }
}
