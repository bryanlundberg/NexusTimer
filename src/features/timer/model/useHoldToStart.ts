import { useRef, useState, useEffect } from 'react'
import { Settings } from '@/shared/types/Settings'
import { TimerStatus } from '@/features/timer/model/enums'
import { triggerHaptic } from '@/shared/model/useHaptics'
import { HAPTIC_DURATION_READY_MS } from '@/shared/lib/haptics'

interface UseHoldToStartProps {
  setTimerStatus: (status: TimerStatus) => void
  settings: Settings
}

export default function useHoldToStart({ setTimerStatus, settings }: UseHoldToStartProps) {
  const holdTimeRequired = settings.timer.holdToStart ? Number(settings.timer.holdToStartTime) : 0
  const startHoldingTime = useRef<number | null>(null)
  const holdingTimeId = useRef<any>(null)
  const hasReachedReady = useRef(false)
  const [holdingTime, setHoldingTime] = useState<number | null>(10)

  const startHold = () => {
    if (!holdingTimeId.current) {
      startHoldingTime.current = Date.now() - 1
      holdingTimeId.current = setInterval(() => {
        if (startHoldingTime.current) {
          const now = Date.now()
          const difference = now - startHoldingTime.current
          setHoldingTime(difference)
          if (difference >= holdTimeRequired) {
            if (!hasReachedReady.current) {
              hasReachedReady.current = true
              triggerHaptic(HAPTIC_DURATION_READY_MS)
            }
            setTimerStatus(TimerStatus.READY)
          } else {
            setTimerStatus(TimerStatus.HOLDING)
          }
        }
      }, 10)
    }
  }

  const removeHolding = () => {
    clearInterval(holdingTimeId.current)
    holdingTimeId.current = null
    startHoldingTime.current = null
    hasReachedReady.current = false
    setHoldingTime(0)
  }

  useEffect(() => {
    return () => {
      if (holdingTimeId.current) {
        clearInterval(holdingTimeId.current)
        holdingTimeId.current = null
      }
    }
  }, [])

  return {
    startHold,
    removeHolding,
    holdingTime,
    holdTimeRequired,
    holdingTimeId,
    startHoldingTime
  }
}
