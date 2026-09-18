'use client'
import { useCallback, useSyncExternalStore } from 'react'
import { apiPatch } from '@/shared/api/client'
import { selfStatusStore } from '@/features/presence/model/presence-store'
import type { PresenceStatus } from '@/shared/lib/realtime/events'

export const PRESENCE_STATUS_KEY = '/api/v1/presence/me'

export function usePresenceStatus() {
  const status = useSyncExternalStore(selfStatusStore.subscribe, selfStatusStore.get, () => 'online' as PresenceStatus)

  const setStatus = useCallback(
    (next: PresenceStatus) => {
      if (next === status) return

      selfStatusStore.set(next)
      apiPatch(PRESENCE_STATUS_KEY, { status: next }).catch(() => selfStatusStore.set(status))
    },
    [status]
  )

  return { status, setStatus }
}

export default usePresenceStatus
