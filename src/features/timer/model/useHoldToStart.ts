import { useRef, useState, useEffect } from 'react'
import { Settings } from '@/shared/types/Settings'
import { TimerStatus } from '@/features/timer/model/enums'

interface UseHoldToStartProps {
  setTimerStatus: (status: TimerStatus) => void
  settings: Settings
}

export default function useHoldToStart({ setTimerStatus, settings }: UseHoldToStartProps) {
  const holdTimeRequired = settings.timer.holdToStart ? Number(settings.timer.holdToStartTime) : 0
  const startHoldingTime = useRef<number | null>(null)
  const holdingTimeId = useRef<any>(null)
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
