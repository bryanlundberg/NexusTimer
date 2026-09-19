import { useEffect, useState } from 'react'

/**
 * Tracks `navigator.onLine`. Reads it on the first client render, not after hydration,
 * so effects never act on an assumed online state while the device is offline.
 */
export function useIsOnline(): boolean {
  const [isOnline, setIsOnline] = useState(() => typeof navigator === 'undefined' || navigator.onLine)

  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine)
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  return isOnline
}
