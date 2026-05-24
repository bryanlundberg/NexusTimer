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
  const intervalRef = useRef<number | null>(null)

  const clearInterval = () => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const start = useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
    performanceStartRef.current = performance.now()
    setSolvingTime(0)
    intervalRef.current = window.setInterval(() => {
      if (performanceStartRef.current != null) {
        setSolvingTime(performance.now() - performanceStartRef.current)
      }
    }, 10)
  }, [isRunning])

  const stop = useCallback((): number => {
    clearInterval()
    setIsRunning(false)
    const finalTime =
      performanceStartRef.current != null ? performance.now() - performanceStartRef.current : solvingTime
    setSolvingTime(finalTime)
    performanceStartRef.current = null
    return finalTime
  }, [solvingTime])

  const reset = useCallback(() => {
    clearInterval()
    setIsRunning(false)
    performanceStartRef.current = null
    setSolvingTime(0)
  }, [])

  useEffect(() => () => clearInterval(), [])

  return { solvingTime, isRunning, start, stop, reset }
}
