'use client'

import { useRealtimeConnection } from '@/features/realtime/model/useRealtimeConnection'
import { useFriendsRealtime } from '@/features/friends/model/useFriendsRealtime'

export default function RealtimeProvider() {
  useRealtimeConnection()
  useFriendsRealtime()
  return null
}
