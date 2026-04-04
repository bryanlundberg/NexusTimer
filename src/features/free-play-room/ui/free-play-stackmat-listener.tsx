'use client'
import { useEffect, useMemo, useRef } from 'react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { TimerStatus } from '@/features/timer/model/enums'
import { useHardwareTimer } from '@/features/hardware/react/useHardwareTimer'
import { StackmatAdapter } from '@/features/hardware/adapters/StackmatAdapter'

const CONNECT_OPTIONS = { moyuMode: false }

interface FreePlayStackmatListenerProps {
  onFinish: (ms: number) => void
  disabled: boolean
}

export default function FreePlayStackmatListener({ onFinish, disabled }: FreePlayStackmatListenerProps) {
  const { setSolvingTime, setIsSolving, setTimerStatus } = useTimerStore()
  const stackmatAdapter = useMemo(() => new StackmatAdapter(), [])
  const { state } = useHardwareTimer({ adapter: stackmatAdapter, autoConnect: true, connectOptions: CONNECT_OPTIONS })
  const wasRunningRef = useRef(false)

  useEffect(() => {
    if (state.running) setSolvingTime(state.timeMs)
  }, [state.timeMs, state.running, setSolvingTime])

  useEffect(() => {
    const wasRunning = wasRunningRef.current
    wasRunningRef.current = state.running

    if (state.running && !wasRunning) {
      setIsSolving(true)
      setTimerStatus(TimerStatus.SOLVING)
    } else if (!state.running && wasRunning && state.timeMs > 0 && !disabled) {
      setIsSolving(false)
      setTimerStatus(TimerStatus.IDLE)
      onFinish(state.timeMs)
    }
  }, [state.running])

  return null
}
