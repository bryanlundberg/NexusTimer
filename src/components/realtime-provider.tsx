'use client'

import { useRealtimeConnection } from '@/features/realtime/model/useRealtimeConnection'
import { useFriendsRealtime } from '@/features/friends/model/useFriendsRealtime'
import { useChatRealtime } from '@/features/chat/model/useChatRealtime'

export default function RealtimeProvider() {
  useRealtimeConnection()
  useFriendsRealtime()
  useChatRealtime()
  return null
}
