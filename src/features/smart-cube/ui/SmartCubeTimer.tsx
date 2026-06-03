'use client'

import { useCallback, useEffect, type ReactNode } from 'react'
import formatTime from '@/shared/lib/formatTime'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useScrambleGuideStore } from '@/shared/model/timer/useScrambleGuideStore'
import { useVirtualCube } from '@/features/timer/model/useVirtualCube'
import { useSolveSession } from '@/features/timer/model/useSolveSession'
import { useSmartCubeMoves } from '@/features/smart-cube/model/useSmartCubeMoves'
import { useSmartCubeGyro } from '@/features/smart-cube/model/useSmartCubeGyro'
import type { SmartCubeConnection } from 'smartcube-web-bluetooth'

interface SmartCubeTimerProps {
  connection: SmartCubeConnection
  secondaryActions?: (onSync: () => void, gyroActive: boolean, onReset: () => void) => ReactNode
}

const CUBE_SIZE = 3

export function SmartCubeTimer({ connection, secondaryActions }: SmartCubeTimerProps) {
  const scramble = useTimerStore((store) => store.scramble)
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const setNewScramble = useTimerStore((store) => store.setNewScramble)
  const setIsSolvingStore = useTimerStore((store) => store.setIsSolving)
  const setScrambleGuide = useScrambleGuideStore((store) => store.setGuide)
  const setScrambleReady = useScrambleGuideStore((store) => store.setReady)
  const resetScrambleGuide = useScrambleGuideStore((store) => store.reset)
  const inspectionEnabled = useSettingsStore((store) => store.settings.timer.inspection)
  const inspectionTimeMs = useSettingsStore((store) => store.settings.timer.inspectionTime)

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

  const { phase, solvingTime, inspectionTime, guide, processMove, resetState } = useSolveSession({
    player,
    engine,
    scramble,
    cubeSize: CUBE_SIZE,
    smart: true,
    scrambleMode: 'manual',
    onAdvanceScramble,
    recreatePlayer,
    inspection: { enabled: inspectionEnabled, durationMs: inspectionTimeMs }
  })

  useEffect(() => {
    setIsSolvingStore(phase === 'solving')
  }, [phase, setIsSolvingStore])

  useEffect(() => {
    setScrambleGuide(guide)
    setScrambleReady(phase === 'armed' || phase === 'inspecting')
  }, [guide, phase, setScrambleGuide, setScrambleReady])

  useEffect(() => () => resetScrambleGuide(), [resetScrambleGuide])

  useEffect(() => {
    if (!scramble && selectedCube) setNewScramble(selectedCube)
  }, [scramble, selectedCube, setNewScramble])

  useSmartCubeMoves({ connection, onMove: processMove })
  const { active: gyroActive, resetOrientation } = useSmartCubeGyro({ player, connection })

  const syncSolved = useCallback(() => {
    resetState()
    if (connection.capabilities.reset) {
      connection.sendCommand({ type: 'REQUEST_RESET' }).catch(() => {})
    }
  }, [resetState, connection])

  return (
    <div className="grow flex flex-col items-center justify-center gap-1.5 sm:gap-3">
      <div ref={containerRef} className="rounded-md overflow-hidden" />

      {phase === 'inspecting' && inspectionTime != null ? (
        <div className="text-2xl sm:text-3xl tabular-nums font-semibold text-orange-500">
          {Math.max(0, Math.trunc(inspectionTime))}
        </div>
      ) : (
        <div className="text-2xl sm:text-3xl tabular-nums">{formatTime(solvingTime || 0)}</div>
      )}

      {secondaryActions?.(syncSolved, gyroActive, resetOrientation)}
    </div>
  )
}
