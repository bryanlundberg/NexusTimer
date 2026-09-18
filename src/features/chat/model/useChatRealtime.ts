import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useSWRConfig } from 'swr'
import { apiPost } from '@/shared/api/client'
import { playSound } from '@/shared/lib/play-sound'
import { DELIVERED_KEY, INBOX_KEY, useInbox } from '@/entities/chat/model/useInbox'
import { useRealtimeEvent } from '@/features/realtime/model/useRealtimeEvent'
import { clearTyping, markTyping } from '@/features/chat/model/typing-store'

const DELIVERY_ACK_DELAY_MS = 500

export function useChatRealtime() {
  const { mutate } = useSWRConfig()
  const { data: session } = useSession()
  const { data: inbox } = useInbox()
  const ackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const acknowledgeDelivery = () => {
    clearTimeout(ackTimer.current)
    ackTimer.current = setTimeout(() => {
      apiPost(DELIVERED_KEY, {}).catch(() => {})
    }, DELIVERY_ACK_DELAY_MS)
  }

  const hasUnread = (inbox?.totalUnread ?? 0) > 0
  useEffect(() => {
    if (hasUnread) acknowledgeDelivery()
  }, [hasUnread])

  useEffect(() => () => clearTimeout(ackTimer.current), [])

  useRealtimeEvent((event) => {
    switch (event.type) {
      case 'message:new': {
        void mutate(INBOX_KEY)
        if (event.message.senderId === session?.user?.id) return

        playSound('messageReceived')
        acknowledgeDelivery()
        clearTyping(event.chatId)
        break
      }
      case 'typing':
        markTyping(event.chatId)
        break
      case 'realtime:reconnected':
        acknowledgeDelivery()
        void mutate(INBOX_KEY)
        break
      case 'chat:read':
      case 'chat:delivered':
      case 'chat:seen':
      case 'message:edited':
      case 'message:deleted':
      case 'chat:cleared':
      case 'chat:removed':
        void mutate(INBOX_KEY)
        break
    }
  })
}
