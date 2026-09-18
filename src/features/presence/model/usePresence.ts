import { useEffect, useMemo, useSyncExternalStore } from 'react'
import { OFFLINE, presenceStore, watchPresence, type PresenceState } from '@/features/presence/model/presence-store'
import type { PresenceDisplay } from '@/shared/lib/realtime/events'

export type { PresenceState }
export type { PresenceDisplay, PresenceStatus } from '@/shared/lib/realtime/events'

export function resolvePresenceDisplay(presence?: PresenceState | null): PresenceDisplay {
  return presence?.state ?? 'offline'
}

export function usePresence(userId?: string | null): PresenceState {
  useEffect(() => {
    if (!userId) return
    return watchPresence([userId])
  }, [userId])

  return useSyncExternalStore(
    presenceStore.subscribe,
    () => presenceStore.get(userId),
    () => OFFLINE
  )
}

export function usePresenceList(userIds: string[]): Record<string, PresenceState> {
  const idsKey = useMemo(() => [...new Set(userIds)].sort().join(','), [userIds])
  const version = useSyncExternalStore(presenceStore.subscribe, presenceStore.getVersion, () => 0)

  useEffect(() => {
    const ids = idsKey ? idsKey.split(',') : []
    if (ids.length === 0) return
    return watchPresence(ids)
  }, [idsKey])

  return useMemo(() => {
    const map: Record<string, PresenceState> = {}
    for (const id of idsKey ? idsKey.split(',') : []) map[id] = presenceStore.get(id)
    return map
  }, [idsKey, version])
}

export { OFFLINE }
export default usePresence
