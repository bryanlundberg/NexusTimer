'use client'

import { useRealtimeConnection } from '@/features/realtime/model/useRealtimeConnection'
import { useFriendsRealtime } from '@/features/friends/model/useFriendsRealtime'
import { useChatRealtime } from '@/features/chat/model/useChatRealtime'
import { usePresenceRealtime } from '@/features/presence/model/usePresenceRealtime'
import { useBackupSync } from '@/shared/model/backup/useBackupSync'

export default function RealtimeProvider() {
  useRealtimeConnection()
  useFriendsRealtime()
  useChatRealtime()
  usePresenceRealtime()
  useBackupSync()
  return null
}
