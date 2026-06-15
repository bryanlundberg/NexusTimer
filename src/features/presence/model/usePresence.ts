import { useEffect, useMemo, useState } from 'react'
import { onValue, ref } from '@firebase/database'
import { rtdb } from '@/shared/config/firebase'

export type PresenceStatus = 'online' | 'away' | 'busy' | 'invisible'
export type PresenceDisplay = 'online' | 'away' | 'busy' | 'offline'

export interface PresenceState {
  online: boolean
  lastOnline: number | null
  status: PresenceStatus
}

interface PresenceNode {
  connections?: Record<string, number> | null
  lastOnline?: number | null
  status?: string | null
}

const VALID_STATUS: PresenceStatus[] = ['online', 'away', 'busy', 'invisible']
const OFFLINE: PresenceState = { online: false, lastOnline: null, status: 'online' }

function parseNode(value: PresenceNode | null | undefined): PresenceState {
  if (!value) return OFFLINE
  const online = !!value.connections && Object.keys(value.connections).length > 0
  const status = VALID_STATUS.includes(value.status as PresenceStatus) ? (value.status as PresenceStatus) : 'online'
  return { online, lastOnline: typeof value.lastOnline === 'number' ? value.lastOnline : null, status }
}

export function resolvePresenceDisplay(presence?: PresenceState | null): PresenceDisplay {
  if (!presence || !presence.online || presence.status === 'invisible') return 'offline'
  return presence.status
}

export function usePresence(userId?: string | null): PresenceState {
  const [state, setState] = useState<PresenceState>(OFFLINE)

  useEffect(() => {
    if (!userId) {
      setState(OFFLINE)
      return
    }

    const userRef = ref(rtdb, `presence/${userId}`)
    const unsubscribe = onValue(userRef, (snapshot) => {
      setState(parseNode(snapshot.val()))
    })

    return () => unsubscribe()
  }, [userId])

  return state
}

export function usePresenceList(userIds: string[]): Record<string, PresenceState> {
  const [map, setMap] = useState<Record<string, PresenceState>>({})

  const idsKey = useMemo(() => Array.from(new Set(userIds)).sort().join(','), [userIds])

  useEffect(() => {
    const ids = idsKey ? idsKey.split(',') : []
    if (ids.length === 0) {
      setMap({})
      return
    }

    const unsubscribers = ids.map((id) => {
      const userRef = ref(rtdb, `presence/${id}`)
      return onValue(userRef, (snapshot) => {
        setMap((prev) => ({ ...prev, [id]: parseNode(snapshot.val()) }))
      })
    })

    return () => unsubscribers.forEach((unsub) => unsub())
  }, [idsKey])

  return map
}

export default usePresence
