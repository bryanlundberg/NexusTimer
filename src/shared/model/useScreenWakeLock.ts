'use client'

import { useEffect } from 'react'

export const useScreenWakeLock = (enabled = true) => {
  useEffect(() => {
    if (!enabled || !('wakeLock' in navigator)) return

    let sentinel: WakeLockSentinel | null = null
    let active = true

    const acquire = async () => {
      if (document.visibilityState !== 'visible' || (sentinel && !sentinel.released)) return
      try {
        const lock = await navigator.wakeLock.request('screen')
        if (active) sentinel = lock
        else await lock.release()
      } catch {}
    }

    acquire()
    document.addEventListener('visibilitychange', acquire)

    return () => {
      active = false
      document.removeEventListener('visibilitychange', acquire)
      sentinel?.release().catch(() => {})
    }
  }, [enabled])
}
