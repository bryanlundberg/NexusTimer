import { useCallback, useRef } from 'react'
import type { TimedMove } from 'cube-state-engine'

export function useSolveReplayRecorder() {
  const startRef = useRef<number | null>(null)
  const movesRef = useRef<TimedMove[]>([])

  const record = useCallback((move: string, opts?: { t?: number }) => {
    const now = performance.now()
    if (startRef.current === null) startRef.current = now
    const t = opts?.t ?? Math.round(now - startRef.current)
    movesRef.current.push({ m: move, t })
  }, [])

  const reset = useCallback(() => {
    startRef.current = null
    movesRef.current = []
  }, [])

  const getMoves = useCallback((): TimedMove[] => movesRef.current.slice(), [])

  return { record, reset, getMoves }
}
