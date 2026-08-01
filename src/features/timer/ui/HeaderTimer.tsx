import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { ScrambleZone } from './ScrambleZone'
import { useWindowSize } from 'react-use-size'
import { cn } from '@/shared/lib/utils'
import { SCRAMBLE_HEIGHT } from '@/shared/const/scramble-height'
import { TimerStatus } from '@/features/timer/model/enums'
import MainCubeSelector from '@/features/select-cube/ui/MainCubeSelector'
import * as React from 'react'
import ButtonNextScramble from '@/features/navigation/ui/button-next-scramble'
import ButtonSelectMode from '@/features/navigation/ui/button-select-mode'
import NewRecordBadge from '@/features/timer/ui/NewRecordBadge'
import RecordRipple from '@/features/timer/ui/RecordRipple'
import TimerRailToggle from '@/features/timer-solves-rail/ui/TimerRailToggle'
import { useFocusModeStore } from '@/features/focus-mode/model/useFocusModeStore'

export default function HeaderTimer() {
  const isSolving = useTimerStore((store) => store.isSolving)
  const timerStatus = useTimerStore((store) => store.timerStatus)
  const lastSolve = useTimerStore((store) => store.lastSolve)
  const timerStatistics = useTimerStore((store) => store.timerStatistics)
  const settings = useSettingsStore((store) => store.settings)
  const isFocusMode = useFocusModeStore((store) => store.isFocusMode)
  const { height } = useWindowSize()

  const isHidden = isSolving || timerStatus !== TimerStatus.IDLE
  const showScramble = !isFocusMode || settings.features.focusModeScramble
  const isPersonalBest =
    !isFocusMode &&
    lastSolve != null &&
    !lastSolve.dnf &&
    lastSolve.time <= timerStatistics.global.best &&
    settings.alerts.bestTime

  return (
    <>
      <RecordRipple active={isPersonalBest} solveId={lastSolve?.id} />
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
            <ButtonNextScramble />
            <ButtonSelectMode />
            <TimerRailToggle />
          </div>
        )}

        {showScramble && <ScrambleZone />}
        {isPersonalBest && (
          <div className={cn('flex justify-center mt-10', height <= SCRAMBLE_HEIGHT && 'mt-5')} id="touch">
            <NewRecordBadge time={lastSolve.time} />
          </div>
        )}
      </div>
    </>
  )
}
