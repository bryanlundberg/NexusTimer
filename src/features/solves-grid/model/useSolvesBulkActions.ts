import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { deleteSolvesBatch } from '@/features/manage-solves/api/deleteSolvesBatch'
import { moveSolvesBatch } from '@/features/manage-solves/api/moveSolvesBatch'
import { SolveTab } from '@/shared/types/enums'

export default function useSolvesBulkActions(tab: SolveTab) {
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const setSelectedCube = useTimerStore((store) => store.setSelectedCube)
  const setCubes = useTimerStore((store) => store.setCubes)
  const cubes = useTimerStore((store) => store.cubes)

  const syncUI = async () => {
    if (!selectedCube) return
    const updatedCube = await cubesDB.getById(selectedCube.id)
    setSelectedCube(updatedCube || null)
    if (cubes && updatedCube) {
      setCubes(cubes.map((cube) => (cube.id === updatedCube.id ? updatedCube : cube)))
    }
  }

  const deleteSelected = async (solveIds: string[]) => {
    if (!selectedCube || solveIds.length === 0) return
    await deleteSolvesBatch({ cubeId: selectedCube.id, solveIds, solveTab: tab })
    await syncUI()
  }

  const moveSelectedToHistory = async (solveIds: string[]) => {
    if (!selectedCube || solveIds.length === 0) return
    await moveSolvesBatch({ cubeId: selectedCube.id, solveIds, fromTab: tab })
    await syncUI()
  }

  return {
    deleteSelected,
    moveSelectedToHistory
  }
}
