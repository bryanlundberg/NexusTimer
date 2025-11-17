import { useTimerStore } from '@/store/timerStore'
import { useSettingsModalStore } from '@/store/SettingsModalStore'
import useTimer from '@/features/timer/model/useTimer'
import { ReactNode } from 'react'
import { TimerStatus } from '@/enums/TimerStatus'
import useSolveData from '@/hooks/useSolveData'
import QuickActions from '@/features/manage-solves/ui/QuickActions'
import DisplayContainer from '@/features/timer/ui/display-container'
import DisplayTime from '@/features/timer/ui/display-time'
import { useAudioTrigger } from '@/shared/model/useAudioTrigger'
import useDeviceMatch from '@/shared/model/useDeviceMatch'

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
        <QuickActions
          solve={lastSolve}
          onDeleteSolve={() => setLastSolve(null)}
          hideCopyButton
          hideMoveToHistory
          hideTransferCollection
        />
      )}
      {children}
    </DisplayContainer>
  )
}
