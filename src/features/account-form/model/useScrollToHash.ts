import { useEffect } from 'react'

export function useScrollToHash(ids: string[]) {
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!ids.includes(id)) return
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }))
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
