import { useCallback, useRef, useState } from 'react'

export interface SolveClock {
  solvingTime: number
  isRunning: boolean
  getElapsed: () => number
  start: () => void
  stop: () => number
  reset: () => void
}

export function useSolveClock(): SolveClock {
  const [solvingTime, setSolvingTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const performanceStartRef = useRef<number | null>(null)
  const frozenTimeRef = useRef(0)

  const getElapsed = useCallback(
    () =>
      performanceStartRef.current != null ? performance.now() - performanceStartRef.current : frozenTimeRef.current,
    []
  )

  const start = useCallback(() => {
    if (performanceStartRef.current != null) return
    performanceStartRef.current = performance.now()
    frozenTimeRef.current = 0
    setIsRunning(true)
    setSolvingTime(0)
  }, [])

  const stop = useCallback((): number => {
    const finalTime = performanceStartRef.current != null ? performance.now() - performanceStartRef.current : 0
    performanceStartRef.current = null
    frozenTimeRef.current = finalTime
    setIsRunning(false)
    setSolvingTime(finalTime)
    return finalTime
  }, [])

  const reset = useCallback(() => {
    performanceStartRef.current = null
    frozenTimeRef.current = 0
    setIsRunning(false)
    setSolvingTime(0)
  }, [])

  return { solvingTime, isRunning, getElapsed, start, stop, reset }
}
