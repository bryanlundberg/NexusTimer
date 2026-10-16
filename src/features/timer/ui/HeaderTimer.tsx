import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { ScrambleZone } from './ScrambleZone'
import { cn } from '@/shared/lib/utils'
import { TimerStatus } from '@/features/timer/model/enums'
import MainCubeSelector from '@/features/select-cube/ui/MainCubeSelector'
import * as React from 'react'
import ButtonNextScramble from '@/features/navigation/ui/button-next-scramble'
import ButtonSelectMode from '@/features/navigation/ui/button-select-mode'
import NewRecordOverlay from '@/features/timer/ui/NewRecordOverlay'
import RecordRipple from '@/features/timer/ui/RecordRipple'
import TimerRailToggle from '@/features/timer-solves-rail/ui/TimerRailToggle'
import { useFocusModeStore } from '@/features/focus-mode/model/useFocusModeStore'
import { useSolveMoment } from '@/features/timer/model/useSolveMoment'

export default function HeaderTimer() {
  const isSolving = useTimerStore((store) => store.isSolving)
  const timerStatus = useTimerStore((store) => store.timerStatus)
  const isFocusMode = useFocusModeStore((store) => store.isFocusMode)
  const { lastSolve, isPersonalBest, improvement } = useSolveMoment()
  const [dismissedSolveId, setDismissedSolveId] = React.useState<string | null>(null)

  const isHidden = isSolving || timerStatus !== TimerStatus.IDLE

  return (
    <>
      <RecordRipple active={isPersonalBest} solveId={lastSolve?.id} />
      {isPersonalBest && lastSolve && dismissedSolveId !== lastSolve.id && (
        <NewRecordOverlay
          key={lastSolve.id}
          solve={lastSolve}
          improvement={improvement}
          hidden={isHidden}
          onDismiss={() => setDismissedSolveId(lastSolve.id)}
        />
      )}
      <div
        className={cn(
          'w-full flex flex-col items-center transition-opacity duration-150',
          !isHidden && 'opacity-100',
          isHidden && 'pointer-events-none',
          isHidden && (isFocusMode ? 'opacity-0' : 'opacity-30')
        )}
      >
        {!isFocusMode && (
          <div className={'flex items-center gap-2 mb-2 w-full'}>
            <MainCubeSelector />
            <ButtonSelectMode />
            <ButtonNextScramble />
            <TimerRailToggle />
          </div>
        )}

        <ScrambleZone />
      </div>
    </>
  )
}
