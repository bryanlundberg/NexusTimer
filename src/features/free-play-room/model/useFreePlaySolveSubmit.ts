import { useCallback } from 'react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { cubesDB } from '@/entities/cube/api/indexdb'
import genId from '@/shared/lib/genId'
import { Solve } from '@/entities/solve/model/types'
import { withPlus2 } from '@/entities/solve/lib/penalty'
import { setRoomPenalty, submitRoomSolve } from '@/features/free-play-room/model/room-actions'

interface Penalty {
  dnf: boolean
  plus2: boolean
}

export interface PendingSolve {
  round: number
  time: number
  scramble: string
}

export function useFreePlaySolveSubmit() {
  const patchCube = useTimerStore((store) => store.patchCube)
  const setSolvingTime = useTimerStore((store) => store.setSolvingTime)
  const setLastSolve = useTimerStore((store) => store.setLastSolve)

  const sendTime = useCallback((round: number): number | null => {
    const time = useTimerStore.getState().solvingTime
    if (!time || !submitRoomSolve(round, time)) return null
    return time
  }, [])

  // Only reflects the penalty (+2 / DNF) on the timer display.
  const showResult = useCallback(
    ({ dnf, plus2 }: Penalty, { time, scramble }: PendingSolve) => {
      const now = Date.now()
      setLastSolve({
        id: genId(),
        startTime: now - time,
        endTime: now,
        scramble,
        bookmark: false,
        time: withPlus2(time, plus2),
        dnf,
        plus2,
        rating: 0,
        cubeId: '',
        comment: '',
        isDeleted: false,
        updatedAt: now
      })
    },
    [setLastSolve]
  )

  const confirm = useCallback(
    async ({ dnf, plus2, cubeId }: Penalty & { cubeId: string | null }, solve: PendingSolve) => {
      const { scramble } = solve
      setRoomPenalty(solve.round, dnf ? 'dnf' : plus2 ? 'plus2' : 'ok')
      showResult({ dnf, plus2 }, solve)
      if (!cubeId) return

      try {
        const cube = await cubesDB.getById(cubeId)
        const now = Date.now()
        const newSolve: Solve = {
          id: genId(),
          startTime: now - solve.time,
          endTime: now,
          scramble,
          bookmark: false,
          time: withPlus2(solve.time, plus2),
          dnf,
          plus2,
          rating: Math.floor(Math.random() * 20) + (scramble?.length || 0),
          cubeId: cube.id,
          comment: '',
          isDeleted: false,
          updatedAt: now
        }
        const updatedCube = {
          ...cube,
          solves: { ...cube.solves, session: [newSolve, ...cube.solves.session] }
        }
        patchCube(await cubesDB.update(updatedCube))
      } catch (e) {
        console.error('Failed to save free-play solve to cube', e)
      }
    },
    [patchCube, showResult]
  )

  const submitManual = useCallback(
    (msTime: number) => {
      setSolvingTime(msTime)
    },
    [setSolvingTime]
  )

  return { sendTime, confirm, showResult, submitManual }
}
