import { useCallback } from 'react'
import { CubeEngine } from 'cube-state-engine'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { sendSolveToServer } from '@/shared/lib/actions'
import { cubesDB } from '@/entities/cube/api/indexdb'
import genId from '@/shared/lib/genId'
import { Solve } from '@/entities/solve/model/types'
import { ReplayMove } from '@/entities/replay/model/types'

interface SavePayload {
  timeMs: number
  scramble: string | null
  dnf: boolean
  replayMoves?: ReplayMove[]
  smart?: boolean
}

export function useSaveVirtualSolve(engine: CubeEngine | null | undefined) {
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const setSelectedCube = useTimerStore((store) => store.setSelectedCube)
  const setLastSolve = useTimerStore((store) => store.setLastSolve)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const solvesSinceLastSync = useSettingsStore((state) => state.settings.sync.totalSolves)

  return useCallback(
    async ({ timeMs, scramble, dnf, replayMoves, smart = false }: SavePayload) => {
      if (!selectedCube || !scramble) return

      const now = Date.now()
      const puzzle = selectedCube.category === '2x2' || selectedCube.category === '2x2 Virtual' ? '2x2x2' : '3x3x3'
      const newSolve: Solve = {
        id: genId(),
        startTime: now - timeMs,
        endTime: now,
        scramble,
        bookmark: false,
        time: timeMs,
        dnf,
        plus2: false,
        rating: Math.floor(Math.random() * 20) + scramble.length,
        cubeId: selectedCube.id,
        comment: '',
        isDeleted: false,
        updatedAt: now,
        ...(replayMoves && replayMoves.length > 0
          ? { replay: { version: 1, puzzle, scramble, durationMs: timeMs, moves: replayMoves } }
          : {})
      }

      sendSolveToServer({
        solve: newSolve,
        solution: engine?.getMoves(true),
        puzzle,
        smart
      }).catch((e) => {
        console.warn('sendSolveToServer error (ignored):', e)
      })

      const updatedCube = {
        ...selectedCube,
        solves: {
          ...selectedCube.solves,
          session: [newSolve, ...selectedCube.solves.session]
        }
      }

      await cubesDB.update(updatedCube)
      setSelectedCube(updatedCube)
      setLastSolve({ ...newSolve })
      updateSetting('sync.totalSolves', 1 + solvesSinceLastSync)
    },
    [engine, selectedCube, setSelectedCube, setLastSolve, updateSetting, solvesSinceLastSync]
  )
}
