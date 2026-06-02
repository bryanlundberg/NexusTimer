'use client'

import { useCallback, useEffect } from 'react'
import { Compass, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import formatTime from '@/shared/lib/formatTime'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useScrambleGuideStore } from '@/shared/model/timer/useScrambleGuideStore'
import { useVirtualCube } from '@/features/timer/model/useVirtualCube'
import { useSolveSession } from '@/features/timer/model/useSolveSession'
import { useSmartCubeMoves } from '@/features/smart-cube/model/useSmartCubeMoves'
import { useSmartCubeGyro } from '@/features/smart-cube/model/useSmartCubeGyro'
import type { SmartCubeConnection } from 'smartcube-web-bluetooth'

interface SmartCubeTimerProps {
  connection: SmartCubeConnection
}

const CUBE_SIZE = 3

export function SmartCubeTimer({ connection }: SmartCubeTimerProps) {
  const scramble = useTimerStore((store) => store.scramble)
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const setNewScramble = useTimerStore((store) => store.setNewScramble)
  const setIsSolvingStore = useTimerStore((store) => store.setIsSolving)
  const setScrambleGuide = useScrambleGuideStore((store) => store.setGuide)
  const setScrambleReady = useScrambleGuideStore((store) => store.setReady)
  const resetScrambleGuide = useScrambleGuideStore((store) => store.reset)

  const { containerRef, player, engine, recreatePlayer } = useVirtualCube({
    cubeSize: CUBE_SIZE,
    scramble,
    seed: false,
    tempoScale: 5,
    dragInput: 'auto'
  })

  const onAdvanceScramble = useCallback(() => {
    if (selectedCube) setNewScramble(selectedCube)
  }, [selectedCube, setNewScramble])

  const { phase, solvingTime, guide, processMove } = useSolveSession({
    player,
    engine,
    scramble,
    cubeSize: CUBE_SIZE,
    smart: true,
    scrambleMode: 'manual',
    onAdvanceScramble,
    recreatePlayer
  })

  useEffect(() => {
    setIsSolvingStore(phase === 'solving')
  }, [phase, setIsSolvingStore])

  useEffect(() => {
    setScrambleGuide(guide)
    setScrambleReady(phase === 'armed')
  }, [guide, phase, setScrambleGuide, setScrambleReady])

  useEffect(() => () => resetScrambleGuide(), [resetScrambleGuide])

  useEffect(() => {
    if (!scramble && selectedCube) setNewScramble(selectedCube)
  }, [scramble, selectedCube, setNewScramble])

  useSmartCubeMoves({ connection, onMove: processMove })
  const { active: gyroActive, resetOrientation } = useSmartCubeGyro({ player, connection })

  const syncSolved = useCallback(() => {
    try {
      engine?.reset()
    } catch {}
    try {
      recreatePlayer()
    } catch {}
    if (connection.capabilities.reset) {
      connection.sendCommand({ type: 'REQUEST_RESET' }).catch(() => {})
    }
  }, [engine, recreatePlayer, connection])

  return (
    <div className="grow flex flex-col items-center justify-center gap-1.5 sm:gap-3">
      <div ref={containerRef} className="rounded-md overflow-hidden" />

      <div className="text-2xl sm:text-3xl tabular-nums">{formatTime(solvingTime || 0)}</div>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <Button type="button" size="sm" variant="secondary" onClick={syncSolved} className="gap-1.5 text-xs sm:text-sm">
          <RotateCcw className="size-3.5 sm:size-4" />
          Reset State
        </Button>
        {gyroActive && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={resetOrientation}
            className="gap-1.5 text-xs sm:text-sm"
          >
            <Compass className="size-3.5 sm:size-4" />
            Reset Orientation
          </Button>
        )}
      </div>
    </div>
  )
}
