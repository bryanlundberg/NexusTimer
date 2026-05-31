'use client'

import { useCallback, useEffect } from 'react'
import { Compass, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import formatTime from '@/shared/lib/formatTime'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
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

  const { phase, isReady, solvingTime, processMove } = useSolveSession({
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

  const hint = phase === 'scrambling' ? 'Apply the scramble on your cube…' : isReady ? 'Ready — start solving' : ''

  return (
    <div className="grow flex flex-col items-center justify-center gap-3">
      <div ref={containerRef} className="rounded-md overflow-hidden" />

      <div className="text-3xl tabular-nums">{formatTime(solvingTime || 0)}</div>
      <p className="h-5 text-sm text-muted-foreground">{hint}</p>

      <div className="flex items-center gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={syncSolved} className="gap-1.5">
          <RotateCcw className="size-4" />
          Sync (cube solved)
        </Button>
        {gyroActive && (
          <Button type="button" size="sm" variant="ghost" onClick={resetOrientation} className="gap-1.5">
            <Compass className="size-4" />
            Reset orientation
          </Button>
        )}
      </div>
    </div>
  )
}
