import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { ScrambleZone } from './ScrambleZone'
import { cn } from '@/shared/lib/utils'
import { TimerStatus } from '@/features/timer/model/enums'
import MainCubeSelector from '@/features/select-cube/ui/MainCubeSelector'
import ButtonNextScramble from '@/features/navigation/ui/button-next-scramble'
import ButtonSelectMode from '@/features/navigation/ui/button-select-mode'
import RecordRipple from '@/features/timer/ui/RecordRipple'
import TimerRailToggle from '@/features/timer-solves-rail/ui/TimerRailToggle'
import { useFocusModeStore } from '@/features/focus-mode/model/useFocusModeStore'
import { useSolveMoment } from '@/features/timer/model/useSolveMoment'

export default function HeaderTimer() {
  const isSolving = useTimerStore((store) => store.isSolving)
  const timerStatus = useTimerStore((store) => store.timerStatus)
  const isFocusMode = useFocusModeStore((store) => store.isFocusMode)
  const { lastSolve, isPersonalBest } = useSolveMoment()

  const isHidden = isSolving || timerStatus !== TimerStatus.IDLE

  return (
    <>
      <RecordRipple active={isPersonalBest} solveId={lastSolve?.id} />
      <div
        className={cn(
          'w-full flex flex-col items-center max-md:transition-opacity duration-150',
          !isHidden && 'opacity-100',
          isHidden && 'opacity-0 pointer-events-none transition-opacity'
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
