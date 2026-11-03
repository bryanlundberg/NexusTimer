import { useEffect } from 'react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { TimerStatus } from '@/features/timer/model/enums'

// Mounted only on /app: the smart cube can report a solve from any page, and those keep their sidebar.
export default function TimerChromeHider() {
  const isSolving = useTimerStore((store) => store.isSolving)
  const timerStatus = useTimerStore((store) => store.timerStatus)

  const isHidden = isSolving || timerStatus !== TimerStatus.IDLE

  useEffect(() => {
    document.documentElement.toggleAttribute('data-timer-active', isHidden)
    return () => document.documentElement.removeAttribute('data-timer-active')
  }, [isHidden])

  return null
}
