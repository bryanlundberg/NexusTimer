import { useEffect, useMemo, useSyncExternalStore } from 'react'
import { OFFLINE, presenceStore, watchPresence, type PresenceState } from '@/features/presence/model/presence-store'
import type { PresenceDisplay } from '@/shared/lib/realtime/events'

export type { PresenceState }
export type { PresenceDisplay, PresenceStatus } from '@/shared/lib/realtime/events'

/**
 * The gateway resolves what each person is allowed to show before publishing it, so there is
 * nothing left to decide here.
 */
export function resolvePresenceDisplay(presence?: PresenceState | null): PresenceDisplay {
  return presence?.state ?? 'offline'
}

export function usePresence(userId?: string | null): PresenceState {
  useEffect(() => {
    if (!userId) return
    return watchPresence([userId])
  }, [userId])

  // The store hands back the same object until that person's state actually changes
  return useSyncExternalStore(
    presenceStore.subscribe,
    () => presenceStore.get(userId),
    () => OFFLINE
  )
}

/** One frame to the gateway however many rows are on screen. */
export function usePresenceList(userIds: string[]): Record<string, PresenceState> {
  const idsKey = useMemo(() => [...new Set(userIds)].sort().join(','), [userIds])
  const version = useSyncExternalStore(presenceStore.subscribe, presenceStore.getVersion, () => 0)

  useEffect(() => {
    const ids = idsKey ? idsKey.split(',') : []
    if (ids.length === 0) return
    return watchPresence(ids)
  }, [idsKey])

  // version is the extra dependency: it is what says the store moved under us
  return useMemo(() => {
    const map: Record<string, PresenceState> = {}
    for (const id of idsKey ? idsKey.split(',') : []) map[id] = presenceStore.get(id)
    return map
  }, [idsKey, version])
}

export { OFFLINE }
export default usePresence
