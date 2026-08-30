import type { TimedMove } from 'cube-state-engine'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { sendSolveToServer } from '@/shared/lib/actions'
import { cubesDB } from '@/entities/cube/api/indexdb'
import genId from '@/shared/lib/genId'
import { Solve } from '@/entities/solve/model/types'

export interface SaveVirtualSolvePayload {
  timeMs: number
  scramble: string | null
  dnf: boolean
  replayMoves?: TimedMove[]
  smart?: boolean
  solution?: string
}

// Reads the stores imperatively so it can run outside React: the smart-cube
// session saves from a Bluetooth event, with no component necessarily mounted.
export async function saveVirtualSolve({
  timeMs,
  scramble,
  dnf,
  replayMoves,
  smart = false,
  solution
}: SaveVirtualSolvePayload): Promise<void> {
  const { selectedCube, setSelectedCube, setLastSolve } = useTimerStore.getState()
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

  sendSolveToServer({ solve: newSolve, solution, puzzle, smart }).catch((e) => {
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

  const { settings, updateSetting } = useSettingsStore.getState()
  updateSetting('sync.totalSolves', 1 + settings.sync.totalSolves)
}
