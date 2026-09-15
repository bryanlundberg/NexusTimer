import { usePathname, useRouter } from 'next/navigation'
import { useChatDockStore } from '@/features/chat/model/chat-dock-store'
import { getDockCapacity } from '@/features/chat/model/dock-capacity'

export const isMessagesRoute = (pathname: string | null) =>
  pathname === '/messages' || !!pathname?.startsWith('/messages/')

export const canUseDock = (pathname: string | null) => !isMessagesRoute(pathname) && getDockCapacity() > 0

export function useOpenChat() {
  const router = useRouter()
  const pathname = usePathname()
  const openWindow = useChatDockStore((state) => state.openWindow)

  return (userId: string) => {
    if (canUseDock(pathname)) openWindow(userId)
    else router.push(`/messages/${userId}`)
  }
}
