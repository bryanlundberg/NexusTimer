'use client'
import { useEffect, useState } from 'react'

/**
 * Tracks which of the given element ids is currently in the viewport's
 * reading band. `observeKey` forces re-observation (e.g. after a remount).
 */
export default function useScrollSpy(ids: readonly string[], observeKey?: unknown) {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-15% 0px -75% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids, observeKey])

  return activeId
}
