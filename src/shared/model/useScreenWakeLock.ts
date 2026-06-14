'use client'

import { useEffect } from 'react'
import { useWakeLock } from 'react-screen-wake-lock'

/**
 * Hook to manage the Screen Wake Lock API.
 * @param enabled - If true, requests the wake lock. If false, releases it.
 */
export const useScreenWakeLock = (enabled: boolean) => {
  const { isSupported, released, request, release } = useWakeLock({
    reacquireOnPageVisible: true
  })

  useEffect(() => {
    if (!isSupported || !enabled) return

    request()

    return () => {
      release().catch(() => {})
    }
  }, [enabled, isSupported, request, release])

  return {
    isSupported,
    released
  }
}
