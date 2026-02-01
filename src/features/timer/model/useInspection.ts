import { useRef, useState, useEffect } from 'react'
import { TimerStatus } from '@/features/timer/model/enums'

interface UseInspectionProps {
  setTimerStatus: (status: TimerStatus) => void
  setSolvingTime: (time: number) => void
  settings: any
}

export default function useInspection({ setTimerStatus, setSolvingTime, settings }: UseInspectionProps) {
  const inspectionDuration = Number(settings.timer.inspectionTime || 15000)
  const startInspectionTime = useRef<number | null>(null)
  const inspectionId = useRef<any>(null)
  const [inspectionTime, setInspectionTime] = useState<number>(inspectionDuration / 1000)

  const startInspection = () => {
    startInspectionTime.current = Date.now() - 1
    setTimerStatus(TimerStatus.INSPECTING)
    let reproduced8 = false
    let reproduced12 = false
    const suffix = settings.sounds?.voiceGender === 'female' ? '_w.mp3' : '_m.mp3'

    inspectionId.current = setInterval(() => {
      if (startInspectionTime.current) {
        const now = Date.now()
        const difference = inspectionDuration - (now - startInspectionTime.current)

        const timeRemaining = difference / 1000

        const timeElapsed = (now - startInspectionTime.current) / 1000

        if (timeElapsed >= 8 && !reproduced8) {
          reproduced8 = true
          const audio8 = new Audio(`/sounds/en/8${suffix}`)
          audio8.play()
        }

        if (timeElapsed >= 12 && !reproduced12) {
          reproduced12 = true
          const audio12 = new Audio(`/sounds/en/12${suffix}`)
          audio12.play()
        }

        setInspectionTime(timeRemaining)
        if (difference <= 0) {
          setTimerStatus(TimerStatus.IDLE)
          setSolvingTime(0)
          removeInspection()
          const audio = new Audio(`/sounds/en/reset${suffix}`)
          audio.play()
        }
      }
    }, 10)
  }

  const removeInspection = () => {
    startInspectionTime.current = null
    clearInterval(inspectionId.current)
    inspectionId.current = null
    setInspectionTime(inspectionDuration / 1000)
  }

  useEffect(() => {
    return () => {
      if (inspectionId.current) {
        clearInterval(inspectionId.current)
        inspectionId.current = null
      }
    }
  }, [])

  return {
    inspectionTime,
    startInspection,
    removeInspection,
    inspectionId,
    startInspectionTime,
    inspectionDuration
  }
}
