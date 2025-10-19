import { useTimerStore } from '@/store/timerStore'
import { useSettingsModalStore } from '@/store/SettingsModalStore'
import useTimer from '@/hooks/useTimer'
import Confetti from 'react-dom-confetti'
import useDeviceMatch from '@/hooks/useDeviceMatch'
import { confettiConfig } from '@/lib/const/confettiConfig'
import MenuSolveOptions from '../menu-solve-options/menu-solve-options'
import DisplayContainer from './display/display-container'
import DisplayTime from './display/display-time'
import { ReactNode } from 'react'
import { TimerStatus } from '@/enums/TimerStatus'
import useSolveData from '@/hooks/useSolveData'
import { useAudioTrigger } from '@/hooks/useAudioTrigger'

export default function Timer({ children }: { children?: ReactNode }) {
  const settings = useSettingsModalStore((store) => store.settings)
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const isSolving = useTimerStore((store) => store.isSolving)
  const lastSolve = useTimerStore((store) => store.lastSolve)
  const timerStatus = useTimerStore((store) => store.timerStatus)
  const solvingTime = useTimerStore((store) => store.solvingTime)
  const timerStatistics = useTimerStore((store) => store.timerStatistics)
  const setLastSolve = useTimerStore((store) => store.setLastSolve)
  const setTimerStatus = useTimerStore((store) => store.setTimerStatus)
  const setIsSolving = useTimerStore((store) => store.setIsSolving)
  const setSolvingTime = useTimerStore((store) => store.setSolvingTime)
  const timerMode = useTimerStore((store) => store.timerMode)

  const { saveSolveMainTimer } = useSolveData()

  const { inspectionTime } = useTimer({
    onFinishSolve: () => saveSolveMainTimer(),
    isSolving,
    setTimerStatus,
    selectedCube,
    inspectionRequired: settings.timer.inspection,
    setIsSolving,
    setSolvingTime,
    timerMode,
    settings
  })

  const { device } = useDeviceMatch()

  const isBestTime = timerStatistics.global.best === lastSolve?.time && !isSolving && settings.sounds.newPersonalBest

  useAudioTrigger({
    audioSrc: './sounds/new-notification.mp3',
    trigger: isBestTime
  })

  return (
    <DisplayContainer>
      {selectedCube && (
        <DisplayTime
          isSolving={isSolving}
          timerStatus={timerStatus}
          lastSolve={lastSolve}
          solvingTime={solvingTime}
          device={device}
          inspectionTime={inspectionTime}
          hideWhileSolving={settings.features.hideWhileSolving}
          inspectionRequired={settings.timer.inspection}
        />
      )}
      {lastSolve && settings.features.quickActionButtons && timerStatus === TimerStatus.IDLE && (
        <MenuSolveOptions
          solve={lastSolve}
          onDeleteSolve={() => setLastSolve(null)}
          caseOfUse="last-solve"
          hideCopyButton
          hideMoveToHistory
          hideTransferCollection
        />
      )}
      {children}
    </DisplayContainer>
  )
}
