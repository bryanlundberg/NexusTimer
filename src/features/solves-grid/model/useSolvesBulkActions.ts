import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { deleteSolvesBatch } from '@/features/manage-solves/api/deleteSolvesBatch'
import { moveSolvesBatch } from '@/features/manage-solves/api/moveSolvesBatch'
import { SolveTab } from '@/shared/types/enums'

export default function useSolvesBulkActions(tab: SolveTab) {
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const patchCube = useTimerStore((store) => store.patchCube)

  const deleteSelected = async (solveIds: string[]) => {
    if (!selectedCube || solveIds.length === 0) return
    patchCube(await deleteSolvesBatch({ cubeId: selectedCube.id, solveIds, solveTab: tab }))
  }

  const moveSelectedToHistory = async (solveIds: string[]) => {
    if (!selectedCube || solveIds.length === 0) return
    patchCube(await moveSolvesBatch({ cubeId: selectedCube.id, solveIds, fromTab: tab }))
  }

  return {
    deleteSelected,
    moveSelectedToHistory
  }
}
