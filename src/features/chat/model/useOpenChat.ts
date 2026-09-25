import { usePathname, useRouter } from '@/shared/config/i18n/navigation'
import { useSWRConfig } from 'swr'
import { apiPost } from '@/shared/api/client'
import type { ChatSummary } from '@/entities/chat/model/types'
import { INBOX_KEY, chatKey } from '@/entities/chat/model/useInbox'
import { useActiveChatStore } from '@/features/chat/model/active-chat-store'
import { useChatDockStore } from '@/features/chat/model/chat-dock-store'
import { useChatDraftStore } from '@/features/chat/model/draft-store'
import { getDockCapacity } from '@/features/chat/model/dock-capacity'

export const isMessagesRoute = (pathname: string | null) => pathname === '/messages'

export const canUseDock = (pathname: string | null) => !isMessagesRoute(pathname) && getDockCapacity() > 0

export function useOpenChat() {
  const router = useRouter()
  const pathname = usePathname()
  const { mutate } = useSWRConfig()
  const openWindow = useChatDockStore((state) => state.openWindow)
  const setActiveChat = useActiveChatStore((state) => state.setActiveChat)
  const setDraft = useChatDraftStore((state) => state.setDraft)

  const openChat = (chatId: string) => {
    if (canUseDock(pathname)) {
      openWindow(chatId)
      return
    }

    setActiveChat(chatId)
    if (!isMessagesRoute(pathname)) router.push('/messages')
  }

  const openChatWith = async (userId: string, draft?: string) => {
    const chat = await apiPost<ChatSummary>(INBOX_KEY, { userId })
    if (draft) setDraft(chat._id, draft)
    void mutate(chatKey(chat._id), chat, { revalidate: false })
    openChat(chat._id)
  }

  return { openChat, openChatWith }
}
