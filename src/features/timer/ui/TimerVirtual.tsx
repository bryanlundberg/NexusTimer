'use client'
import { useCallback, useEffect } from 'react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import formatTime from '@/shared/lib/formatTime'
import { useVirtualCube } from '@/features/timer/model/useVirtualCube'
import { useVirtualKeyboardMoves } from '@/features/timer/model/useVirtualKeyboardMoves'
import { useSolveSession } from '@/features/timer/model/useSolveSession'
import { SolveClockText } from '@/features/timer/ui/SolveClockText'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { timerFontClass } from '@/features/timer/model/timerFonts'
import { cn } from '@/shared/lib/utils'

const PLAYER_SIZE = 'min(320px, 30vw, max(8rem, 100cqh - 5rem))'

export default function TimerVirtual() {
  const scramble = useTimerStore((store) => store.scramble)
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const setNewScramble = useTimerStore((store) => store.setNewScramble)
  const setIsSolvingStore = useTimerStore((store) => store.setIsSolving)
  const timerFont = useSettingsStore((state) => state.settings.features.timerFont)

  const cubeSize = selectedCube?.category === '2x2' || selectedCube?.category === '2x2 Virtual' ? 2 : 3
  const is3x3 = cubeSize === 3

  const { containerRef, player, engine, recreatePlayer } = useVirtualCube({
    cubeSize,
    scramble,
    tempoScale: 3,
    hintFacelets: 'floating',
    sizePx: PLAYER_SIZE
  })

  const onAdvanceScramble = useCallback(() => {
    if (selectedCube) setNewScramble(selectedCube)
  }, [selectedCube, setNewScramble])

  const { phase, clock, processMove, cancel } = useSolveSession({
    player,
    engine,
    scramble,
    onAdvanceScramble,
    recreatePlayer
  })

  useEffect(() => {
    setIsSolvingStore(phase === 'solving')
  }, [phase, setIsSolvingStore])

  useVirtualKeyboardMoves({ is3x3, processMove, cancel })

  return (
    <div className="grow min-h-0 flex justify-center items-center flex-col gap-2 sm:gap-4 [container-type:size]">
      <div ref={containerRef} />
      <div className={cn('text-4xl tabular-nums sm:text-5xl md:text-6xl', timerFontClass(timerFont))}>
        <SolveClockText clock={clock} format={formatTime} />
      </div>
    </div>
  )
}
