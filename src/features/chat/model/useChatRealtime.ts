import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { apiPost } from '@/shared/api/client'
import { DELIVERED_KEY, INBOX_KEY, useInbox } from '@/entities/chat/model/useInbox'
import { useRealtimeEvent } from '@/features/realtime/model/useRealtimeEvent'
import { clearTyping, markTyping } from '@/features/chat/model/typing-store'
import { useChatDockStore } from '@/features/chat/model/chat-dock-store'
import { canUseDock, useOpenChat } from '@/features/chat/model/useOpenChat'
import { getDockCapacity } from '@/features/chat/model/dock-capacity'

const TOAST_PREVIEW_LENGTH = 80
// Groups a burst of incoming messages into a single delivery acknowledgement
const DELIVERY_ACK_DELAY_MS = 500

export function useChatRealtime() {
  const t = useTranslations('Index.ChatPage')
  const { mutate } = useSWRConfig()
  const { data: session } = useSession()
  const { data: inbox } = useInbox()
  const pathname = usePathname()
  const openChat = useOpenChat()
  const ackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const acknowledgeDelivery = () => {
    clearTimeout(ackTimer.current)
    ackTimer.current = setTimeout(() => {
      apiPost(DELIVERED_KEY, {}).catch(() => {})
    }, DELIVERY_ACK_DELAY_MS)
  }

  // Messages that arrived while this user was offline get acknowledged once the inbox loads
  const hasUnread = (inbox?.totalUnread ?? 0) > 0
  useEffect(() => {
    if (hasUnread) acknowledgeDelivery()
  }, [hasUnread])

  useEffect(() => () => clearTimeout(ackTimer.current), [])

  const isConversationVisible = (userId: string) => {
    if (pathname === `/messages/${userId}`) return true
    if (!canUseDock(pathname)) return false
    return useChatDockStore
      .getState()
      .windows.slice(0, getDockCapacity())
      .some((dockWindow) => dockWindow.userId === userId && !dockWindow.minimized)
  }

  useRealtimeEvent((event) => {
    switch (event.type) {
      case 'message:new': {
        void mutate(INBOX_KEY)
        if (event.message.senderId === session?.user?.id) return

        acknowledgeDelivery()
        clearTyping(event.userId)
        if (isConversationVisible(event.userId)) return

        const sender = inbox?.threads.find((thread) => thread.user._id === event.userId)?.user.name
        toast(sender ?? t('new-message'), {
          id: `chat-${event.userId}`,
          description: event.message.text.slice(0, TOAST_PREVIEW_LENGTH),
          // The floating chat dock lives at the bottom right
          position: 'top-right',
          action: { label: t('open'), onClick: () => openChat(event.userId) }
        })
        break
      }
      case 'typing':
        markTyping(event.userId)
        break
      case 'realtime:reconnected':
        acknowledgeDelivery()
        void mutate(INBOX_KEY)
        break
      case 'chat:read':
      case 'chat:delivered':
      case 'chat:seen':
        void mutate(INBOX_KEY)
        break
    }
  })
}
