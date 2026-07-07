'use client'
import { useCallback, useEffect } from 'react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import formatTime from '@/shared/lib/formatTime'
import { useVirtualCube } from '@/features/timer/model/useVirtualCube'
import { useVirtualKeyboardMoves } from '@/features/timer/model/useVirtualKeyboardMoves'
import { useSolveSession } from '@/features/timer/model/useSolveSession'

export default function TimerVirtual() {
  const scramble = useTimerStore((store) => store.scramble)
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const setNewScramble = useTimerStore((store) => store.setNewScramble)
  const setIsSolvingStore = useTimerStore((store) => store.setIsSolving)

  const cubeSize = selectedCube?.category === '2x2' || selectedCube?.category === '2x2 Virtual' ? 2 : 3
  const is3x3 = cubeSize === 3

  const { containerRef, player, engine, recreatePlayer } = useVirtualCube({ cubeSize, scramble })

  const onAdvanceScramble = useCallback(() => {
    if (selectedCube) setNewScramble(selectedCube)
  }, [selectedCube, setNewScramble])

  const { phase, solvingTime, processMove, cancel } = useSolveSession({
    player,
    engine,
    scramble,
    cubeSize,
    smart: false,
    scrambleMode: 'auto',
    onAdvanceScramble,
    recreatePlayer
  })

  useEffect(() => {
    setIsSolvingStore(phase === 'solving')
  }, [phase, setIsSolvingStore])

  useVirtualKeyboardMoves({ is3x3, processMove, cancel })

  return (
    <div className="grow flex justify-center items-center flex-col gap-2 sm:gap-4">
      <div ref={containerRef} />
      <div className="text-2xl sm:text-3xl">{formatTime(solvingTime || 0)}</div>
    </div>
  )
}
