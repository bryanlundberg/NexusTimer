import { useRef, useEffect } from 'react'
import { TimerStatus } from '@/features/timer/model/enums'
import { TimerSettings } from '@/features/timer/model/timerSettings'
import { triggerHaptic } from '@/shared/model/useHaptics'
import { HAPTIC_DURATION_READY_MS } from '@/shared/lib/haptics'

interface UseHoldToStartProps {
  setTimerStatus: (status: TimerStatus) => void
  settings: TimerSettings
}

export default function useHoldToStart({ setTimerStatus, settings }: UseHoldToStartProps) {
  const holdTimeRequired = settings.timer.holdToStart ? Number(settings.timer.holdToStartTime ?? 0) : 0
  const startHoldingTime = useRef<number | null>(null)
  const readyTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearReadyTimeout = () => {
    if (readyTimeoutId.current !== null) clearTimeout(readyTimeoutId.current)
    readyTimeoutId.current = null
  }

  const startHold = (startedAt = performance.now()) => {
    if (startHoldingTime.current !== null) return
    startHoldingTime.current = startedAt

    const markReady = () => {
      readyTimeoutId.current = null
      triggerHaptic(HAPTIC_DURATION_READY_MS)
      setTimerStatus(TimerStatus.READY)
    }

    const remaining = holdTimeRequired - (performance.now() - startedAt)
    if (remaining <= 0) {
      markReady()
      return
    }
    setTimerStatus(TimerStatus.HOLDING)
    readyTimeoutId.current = setTimeout(markReady, remaining)
  }

  const isHolding = () => startHoldingTime.current !== null

  const heldFor = (releasedAt = performance.now()) =>
    startHoldingTime.current === null ? 0 : releasedAt - startHoldingTime.current

  const removeHolding = () => {
    clearReadyTimeout()
    startHoldingTime.current = null
  }

  useEffect(() => clearReadyTimeout, [])

  return {
    startHold,
    removeHolding,
    isHolding,
    heldFor,
    holdTimeRequired
  }
}
