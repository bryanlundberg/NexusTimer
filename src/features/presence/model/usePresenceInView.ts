'use client'
import { useEffect, useState, type RefCallback } from 'react'
import { usePresence, type PresenceState } from '@/features/presence/model/usePresence'

const ROOT_MARGIN = '300px'

interface Watched {
  ref: RefCallback<HTMLDivElement>
  presence: PresenceState
}

export function usePresenceInView(userId?: string | null): Watched {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: ROOT_MARGIN })
    observer.observe(element)
    return () => observer.disconnect()
  }, [element])

  const presence = usePresence(userId, inView)

  return { ref: setElement, presence }
}

export default usePresenceInView
