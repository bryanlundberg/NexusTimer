import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import genId from '@/shared/lib/genId'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import convertToMs from '@/shared/lib/convertToMs'
import { useState } from 'react'
import { Solve } from '@/entities/solve/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'

export default function useSolveData() {
  const solvingTime = useTimerStore((store) => store.solvingTime)
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const scramble = useTimerStore((store) => store.scramble)
  const setSelectedCube = useTimerStore((store) => store.setSelectedCube)
  const setLastSolve = useTimerStore((store) => store.setLastSolve)
  const setNewScramble = useTimerStore((store) => store.setNewScramble)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const solvesSinceLastSync = useSettingsStore((state) => state.settings.sync.totalSolves)
  const [value, setValue] = useState<string>('')

  const saveSolveMainTimer = async () => {
    if (selectedCube && scramble) {
      const lastSolve: Solve = {
        id: genId(),
        startTime: Date.now() - solvingTime,
        endTime: Date.now(),
        scramble: scramble,
        bookmark: false,
        time: solvingTime,
        dnf: false,
        plus2: false,
        rating: Math.floor(Math.random() * 20) + scramble.length,
        cubeId: selectedCube.id,
        comment: '',
        isDeleted: false,
        updatedAt: Date.now()
      }

      setLastSolve({ ...lastSolve })

      const updatedCube = {
        ...selectedCube,
        solves: {
          ...selectedCube.solves,
          session: [lastSolve, ...selectedCube.solves.session]
        }
      }

      await cubesDB.update(updatedCube)
      setSelectedCube(updatedCube)
      updateSetting('sync.totalSolves', 1 + solvesSinceLastSync)
    }

    setNewScramble(selectedCube)
  }

  const saveSolveManualMode = async (msTime: number) => {
    if (!selectedCube) return
    if (!scramble) return
    if (msTime === 0) return

    const now = Date.now()

    const newSolve: Solve = {
      id: genId(),
      startTime: now - msTime,
      endTime: Date.now(),
      scramble: scramble,
      bookmark: false,
      time: msTime,
      dnf: false,
      plus2: false,
      rating: Math.floor(Math.random() * 20) + scramble.length,
      cubeId: selectedCube.id,
      comment: '',
      updatedAt: now,
      isDeleted: false
    }

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
    setNewScramble(selectedCube)
    setValue('')
    updateSetting('sync.totalSolves', 1 + solvesSinceLastSync)
  }

  return {
    saveSolveMainTimer,
    value,
    setValue,
    saveSolveManualMode
  }
}
