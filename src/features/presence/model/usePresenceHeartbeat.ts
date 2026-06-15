import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { onDisconnect, onValue, push, ref, remove, serverTimestamp, set, update } from '@firebase/database'
import { rtdb } from '@/shared/config/firebase'
import { usePresenceStatus } from '@/features/presence/model/usePresenceStatus'

/**
 * Online = `connections` has ≥ 1 child. `onDisconnect` cleans up automatically.
 */
export function usePresenceHeartbeat() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const name = session?.user?.name ?? 'Anonymous'
  const image = session?.user?.image ?? null

  const { status } = usePresenceStatus()
  const isInvisible = status === 'invisible'

  useEffect(() => {
    if (!userId || isInvisible) return

    const connectedRef = ref(rtdb, '.info/connected')
    const userRef = ref(rtdb, `presence/${userId}`)
    const connectionsRef = ref(rtdb, `presence/${userId}/connections`)
    const lastOnlineRef = ref(rtdb, `presence/${userId}/lastOnline`)

    let myConnRef: ReturnType<typeof push> | null = null

    const unsubscribe = onValue(connectedRef, async (snapshot) => {
      if (snapshot.val() !== true) return

      myConnRef = push(connectionsRef)
      await onDisconnect(myConnRef).remove()
      await onDisconnect(lastOnlineRef).set(serverTimestamp())

      await set(myConnRef, serverTimestamp())
      // Note: `status` is intentionally NOT written here, it's account-level and
      // owned by setStatus, so devices don't overwrite each other.
      await update(userRef, {
        lastOnline: serverTimestamp(),
        meta: { name, image }
      })
    })

    return () => {
      unsubscribe()
      if (myConnRef) {
        remove(myConnRef).catch(() => {})
        set(lastOnlineRef, serverTimestamp()).catch(() => {})
      }
    }
  }, [userId, name, image, isInvisible])
}

export default usePresenceHeartbeat
