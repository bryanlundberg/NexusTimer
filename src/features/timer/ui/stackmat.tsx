'use client'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useEffect, useMemo, useRef } from 'react'
import { TimerStatus } from '@/features/timer/model/enums'
import { useScreenWakeLock } from '@/shared/model/useScreenWakeLock'
import { useHardwareTimer } from '@/features/hardware/react/useHardwareTimer'
import { StackmatAdapter } from '@/features/hardware/adapters/StackmatAdapter'
import useSolveData from '@/features/timer/model/useSolveData'

export default function Stackmat() {
  const { timerStatus, setTimerStatus, setIsSolving, setSolvingTime, isSolving } = useTimerStore()

  useScreenWakeLock(isSolving || timerStatus === TimerStatus.INSPECTING)

  const stackmatAdapter = useMemo(() => new StackmatAdapter(), [])
  const { state } = useHardwareTimer({
    adapter: stackmatAdapter,
    autoConnect: true,
    connectOptions: { moyuMode: false }
  })

  const { saveSolveManualMode } = useSolveData()
  const wasRunningRef = useRef(false)

  useEffect(() => {
    if (state.running) {
      setSolvingTime(state.timeMs)
    }
  }, [state.timeMs, state.running, setSolvingTime])

  useEffect(() => {
    const wasRunning = wasRunningRef.current
    wasRunningRef.current = state.running

    if (state.running && !wasRunning) {
      setIsSolving(true)
      setTimerStatus(TimerStatus.SOLVING)
    } else if (!state.running && wasRunning && state.timeMs > 0) {
      setIsSolving(false)
      setTimerStatus(TimerStatus.IDLE)
      void saveSolveManualMode(state.timeMs)
    }
  }, [state.running])

  return null
}
