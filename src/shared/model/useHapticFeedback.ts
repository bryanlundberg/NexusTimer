import { useEffect, useRef } from 'react'
import { TimerStatus } from '@/features/timer/model/enums'
import { vibrate, haptics } from '@/shared/lib/haptics'

/**
 * Fires a short haptic pulse the instant the timer transitions into READY,
 * signalling the user the cube is armed and they can release to start.
 *
 * Relies on the timerStatus selector only re-rendering on actual value
 * changes (Zustand uses Object.is), so the effect runs once per transition
 * even though READY is set repeatedly inside the hold interval.
 */
export function useHapticFeedback(timerStatus: TimerStatus, enabled: boolean) {
  const prevStatus = useRef<TimerStatus | null>(null)

  useEffect(() => {
    if (enabled && timerStatus === TimerStatus.READY && prevStatus.current !== TimerStatus.READY) {
      vibrate(haptics.ready)
    }
    prevStatus.current = timerStatus
  }, [timerStatus, enabled])
}
