import { useRef } from 'react'
import useTimerControls from './useTimerControls'
import useInspection from './useInspection'
import useHoldToStart from './useHoldToStart'
import useEventHandlers from './useEventHandlers'
import { TimerStatus } from '@/features/timer/model/enums'
import { Cube } from '@/entities/cube/model/types'
import { triggerHaptic } from '@/shared/model/useHaptics'

interface UseTimerProps {
  isSolving: boolean
  setTimerStatus: (status: TimerStatus) => void
  selectedCube: Cube | null
  inspectionRequired: boolean
  setIsSolving: (isSolving: boolean) => void
  setSolvingTime: (time: number) => void
  timerMode?: any
  settings?: any
  onFinishSolve: () => void
}

export default function useTimer({
  isSolving,
  setTimerStatus,
  selectedCube,
  inspectionRequired,
  setIsSolving,
  setSolvingTime,
  timerMode = 'NORMAL',
  settings = { timer: { startCue: false, holdToStart: false } },
  onFinishSolve
}: UseTimerProps) {
  const { startTimer, resetTimer, stopTimer } = useTimerControls({
    setSolvingTime,
    setIsSolving,
    setTimerStatus
  })

  const { inspectionTime, startInspection, removeInspection, inspectionId } = useInspection({
    setTimerStatus,
    setSolvingTime,
    settings
  })

  const { startHold, removeHolding, holdingTime, holdTimeRequired, holdingTimeId } = useHoldToStart({
    setTimerStatus,
    settings
  })

  const mustReleaseAfterInspection = useRef<boolean>(false)

  const resetAll = () => {
    if (inspectionId.current) removeInspection()
    resetTimer()
  }

  // MAIN HOLD CONTROL
  const handleHold = (isReleased: boolean) => {
    if (!selectedCube) return
    if (isSolving && isReleased) {
      stopTimer()
      setTimerStatus(TimerStatus.IDLE)
      requestAnimationFrame(() => {
        onFinishSolve()
        resetTimer()
      })
    }
    if (!isReleased && !inspectionId.current) return
    if (!isSolving) {
      if (!inspectionId.current && inspectionRequired) {
        startInspection()
        setTimerStatus(TimerStatus.INSPECTING)
        mustReleaseAfterInspection.current = true
        return
      }
      // Block starting hold during inspection until the user releases after inspection has started
      if (inspectionId.current && inspectionRequired && mustReleaseAfterInspection.current) {
        return
      }
      startHold()
    }
  }

  // MAIN RELEASE CONTROL
  const handleRelease = () => {
    // Ensure user must lift finger after starting inspection before allowing hold to start
    mustReleaseAfterInspection.current = false
    if (!selectedCube) return
    if (!holdingTimeId.current) return
    if (typeof holdingTime === 'number' && holdingTime <= holdTimeRequired) {
      removeHolding()
      if (inspectionId.current) {
        setTimerStatus(TimerStatus.INSPECTING)
      } else {
        setTimerStatus(TimerStatus.IDLE)
      }
      return
    }
    if (inspectionId.current && inspectionRequired) {
      removeInspection()
      removeHolding()
      setTimerStatus(TimerStatus.READY)
      triggerHaptic()
      startTimer()
      return
    }
    if (!inspectionRequired) {
      removeInspection()
      removeHolding()
      setTimerStatus(TimerStatus.READY)
      triggerHaptic()
      startTimer()
      return
    }
  }

  // Event handlers
  useEventHandlers({
    timerMode,
    handleHold,
    handleRelease,
    resetTimer: resetAll,
    isSolving
  })

  return {
    inspectionTime,
    resetAll,
    stopTimer
  }
}
