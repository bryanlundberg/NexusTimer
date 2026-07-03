import { useEffect, useRef } from 'react'
import type { TimerState } from '@/features/hardware/types'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'

export function useStackmatReset(state: TimerState) {
  const { setLastSolve, setSolvingTime } = useTimerStore.getState()
  const prevIdleTimeRef = useRef(0)

  useEffect(() => {
    if (state.running) {
      prevIdleTimeRef.current = state.timeMs
      return
    }

    const prevIdleTime = prevIdleTimeRef.current
    prevIdleTimeRef.current = state.timeMs

    if (prevIdleTime > 0 && state.timeMs === 0) {
      setLastSolve(null)
      setSolvingTime(0)
    }
  }, [state.timeMs, state.running, setLastSolve, setSolvingTime])
}
