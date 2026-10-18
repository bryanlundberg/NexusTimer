import { useRef, useState, useEffect } from 'react'
import { TimerStatus } from '@/features/timer/model/enums'
import { TimerSettings } from '@/features/timer/model/timerSettings'
import { InspectionPenalty, inspectionLabel, inspectionPenalty } from '@/features/timer/lib/inspection'

interface UseInspectionProps {
  setTimerStatus: (status: TimerStatus) => void
  settings: TimerSettings
}

export default function useInspection({ setTimerStatus, settings }: UseInspectionProps) {
  const inspectionDuration = Number(settings.timer.inspectionTime || 15000)
  const startInspectionTime = useRef<number | null>(null)
  const inspectionId = useRef<ReturnType<typeof setInterval> | null>(null)
  const [inspectionTime, setInspectionTime] = useState<number>(inspectionDuration / 1000)

  const remainingAt = (at: number) =>
    startInspectionTime.current === null
      ? inspectionDuration / 1000
      : (inspectionDuration - (at - startInspectionTime.current)) / 1000

  const startInspection = (elapsedMs = 0, startedAt = performance.now()) => {
    startInspectionTime.current = startedAt - elapsedMs
    setTimerStatus(TimerStatus.INSPECTING)
    let reproduced8 = false
    let reproduced12 = false
    const suffix = settings.sounds?.voiceGender === 'female' ? '_w.mp3' : '_m.mp3'

    inspectionId.current = setInterval(() => {
      if (startInspectionTime.current === null) return
      const now = performance.now()
      const timeElapsed = (now - startInspectionTime.current) / 1000

      if (timeElapsed >= 8 && !reproduced8) {
        reproduced8 = true
        if (settings.sounds?.inspection) {
          const audio8 = new Audio(`/sounds/en/8${suffix}`)
          audio8.play()
        }
      }

      if (timeElapsed >= 12 && !reproduced12) {
        reproduced12 = true
        if (settings.sounds?.inspection) {
          const audio12 = new Audio(`/sounds/en/12${suffix}`)
          audio12.play()
        }
      }

      const timeRemaining = remainingAt(now)
      setInspectionTime((shown) => (inspectionLabel(shown) === inspectionLabel(timeRemaining) ? shown : timeRemaining))
    }, 10)
  }

  const penaltyAt = (at = performance.now()): InspectionPenalty => inspectionPenalty(remainingAt(at))

  const removeInspection = () => {
    startInspectionTime.current = null
    if (inspectionId.current !== null) clearInterval(inspectionId.current)
    inspectionId.current = null
    setInspectionTime(inspectionDuration / 1000)
  }

  useEffect(() => {
    return () => {
      if (inspectionId.current !== null) {
        clearInterval(inspectionId.current)
        inspectionId.current = null
      }
    }
  }, [])

  return {
    inspectionTime,
    startInspection,
    removeInspection,
    penaltyAt,
    inspectionId,
    startInspectionTime,
    inspectionDuration
  }
}
