import { usePathname, useRouter } from 'next/navigation'
import { useActiveChatStore } from '@/features/chat/model/active-chat-store'
import { useChatDockStore } from '@/features/chat/model/chat-dock-store'
import { getDockCapacity } from '@/features/chat/model/dock-capacity'

export const isMessagesRoute = (pathname: string | null) => pathname === '/messages'

export const canUseDock = (pathname: string | null) => !isMessagesRoute(pathname) && getDockCapacity() > 0

export function useOpenChat() {
  const router = useRouter()
  const pathname = usePathname()
  const openWindow = useChatDockStore((state) => state.openWindow)
  const setActiveChat = useActiveChatStore((state) => state.setActiveChat)

  return (userId: string) => {
    if (canUseDock(pathname)) {
      openWindow(userId)
      return
    }

    setActiveChat(userId)
    if (!isMessagesRoute(pathname)) router.push('/messages')
  }
}
