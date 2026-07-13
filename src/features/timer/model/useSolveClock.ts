import { useCallback, useEffect, useRef, useState } from 'react'

export interface SolveClock {
  solvingTime: number
  isRunning: boolean
  start: () => void
  stop: () => number
  reset: () => void
}

export function useSolveClock(): SolveClock {
  const [solvingTime, setSolvingTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const performanceStartRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  const cancelRaf = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  const start = useCallback(() => {
    if (rafRef.current != null) return
    setIsRunning(true)
    performanceStartRef.current = performance.now()
    setSolvingTime(0)
    const tick = () => {
      if (performanceStartRef.current == null) return
      setSolvingTime(performance.now() - performanceStartRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const stop = useCallback((): number => {
    cancelRaf()
    setIsRunning(false)
    const finalTime = performanceStartRef.current != null ? performance.now() - performanceStartRef.current : 0
    setSolvingTime(finalTime)
    performanceStartRef.current = null
    return finalTime
  }, [])

  const reset = useCallback(() => {
    cancelRaf()
    setIsRunning(false)
    performanceStartRef.current = null
    setSolvingTime(0)
  }, [])

  useEffect(() => () => cancelRaf(), [])

  return { solvingTime, isRunning, start, stop, reset }
}
