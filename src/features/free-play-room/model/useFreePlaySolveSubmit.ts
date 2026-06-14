import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { cubesDB } from '@/entities/cube/api/indexdb'
import genId from '@/shared/lib/genId'
import { Solve } from '@/entities/solve/model/types'
import useFreeMode from '@/features/free-play-room/model/useFreeMode'

interface SubmitParams {
  dnf: boolean
  plus2: boolean
  cubeId: string | null
}

interface UseFreePlaySolveSubmitArgs {
  roomId: string | null
  scramble: string
  currentRound: number
}

export function useFreePlaySolveSubmit({ roomId, scramble, currentRound }: UseFreePlaySolveSubmitArgs) {
  const { addUserSolve } = useFreeMode()
  const { data: session } = useSession()
  const solvingTime = useTimerStore((store) => store.solvingTime)
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const setSelectedCube = useTimerStore((store) => store.setSelectedCube)
  const setCubes = useTimerStore((store) => store.setCubes)
  const setSolvingTime = useTimerStore((store) => store.setSolvingTime)
  const setLastSolve = useTimerStore((store) => store.setLastSolve)

  const submit = useCallback(
    async ({ dnf, plus2, cubeId }: SubmitParams) => {
      if (!session?.user?.id || !roomId || !solvingTime) return

      await addUserSolve(roomId, session.user.id, {
        time: solvingTime,
        dnf,
        plus2,
        scramble,
        roundIndex: currentRound
      })

      // Only for reflect the penalty (+2 / DNF) on the timer display after submitting.
      const now = Date.now()
      setLastSolve({
        id: genId(),
        startTime: now - solvingTime,
        endTime: now,
        scramble,
        bookmark: false,
        time: solvingTime,
        dnf,
        plus2,
        rating: 0,
        cubeId: cubeId ?? '',
        comment: '',
        isDeleted: false,
        updatedAt: now
      })

      if (!cubeId) return

      try {
        const cube = await cubesDB.getById(cubeId)
        const now = Date.now()
        const newSolve: Solve = {
          id: genId(),
          startTime: now - solvingTime,
          endTime: now,
          scramble,
          bookmark: false,
          time: solvingTime,
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
        await cubesDB.update(updatedCube)

        if (selectedCube?.id === updatedCube.id) {
          setSelectedCube(updatedCube)
        }
        const all = await cubesDB.getAll()
        setCubes(all)
      } catch (e) {
        console.error('Failed to save free-play solve to cube', e)
      }
    },
    [
      session?.user?.id,
      roomId,
      solvingTime,
      scramble,
      currentRound,
      addUserSolve,
      selectedCube,
      setSelectedCube,
      setCubes,
      setLastSolve
    ]
  )

  const submitManual = useCallback(
    (msTime: number) => {
      setSolvingTime(msTime)
    },
    [setSolvingTime]
  )

  return { submit, submitManual }
}
