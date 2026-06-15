'use client'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { onValue, ref, set } from '@firebase/database'
import { rtdb } from '@/shared/config/firebase'
import type { PresenceStatus } from '@/features/presence/model/usePresence'

const VALID: PresenceStatus[] = ['online', 'away', 'busy', 'invisible']
const isValid = (v: unknown): v is PresenceStatus => typeof v === 'string' && VALID.includes(v as PresenceStatus)

export function usePresenceStatus() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [status, setStatusState] = useState<PresenceStatus>('online')

  useEffect(() => {
    if (!userId) {
      setStatusState('online')
      return
    }
    const statusRef = ref(rtdb, `presence/${userId}/status`)
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const value = snapshot.val()
      setStatusState(isValid(value) ? value : 'online')
    })
    return () => unsubscribe()
  }, [userId])

  const setStatus = useCallback(
    (next: PresenceStatus) => {
      if (!userId) return
      set(ref(rtdb, `presence/${userId}/status`), next).catch(() => {})
    },
    [userId]
  )

  return { status, setStatus }
}

export default usePresenceStatus
