import { useEffect, useSyncExternalStore } from 'react'
import {
  presenceStore,
  UNKNOWN,
  watchPresence,
  type PresenceState,
  type PresenceView
} from '@/features/presence/model/presence-store'

export type { PresenceState, PresenceView }
export type { PresenceDisplay, PresenceStatus } from '@/shared/lib/realtime/events'

export function resolvePresenceDisplay(presence?: PresenceState | null): PresenceView {
  return presence?.state ?? 'unknown'
}

export function usePresence(userId?: string | null, watch = true): PresenceState {
  useEffect(() => {
    if (!userId || !watch) return
    return watchPresence([userId])
  }, [userId, watch])

  return useSyncExternalStore(
    presenceStore.subscribe,
    () => presenceStore.get(userId),
    () => UNKNOWN
  )
}

export { UNKNOWN }
export default usePresence
