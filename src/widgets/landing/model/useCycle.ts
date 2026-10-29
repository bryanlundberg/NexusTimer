import { useEffect, useState } from 'react'

export function useCycle(count: number, intervalMs: number, running: boolean) {
  const [index, setIndex] = useState(-1)

  useEffect(() => {
    if (!running || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), intervalMs)
    return () => clearInterval(id)
  }, [count, intervalMs, running])

  return index
}
