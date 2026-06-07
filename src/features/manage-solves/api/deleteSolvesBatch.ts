import { SolveTab } from '@/shared/types/enums'
import { Cube } from '@/entities/cube/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'

interface DeleteSolvesBatchDTO {
  cubeId: string
  solveIds: string[]
  solveTab: SolveTab
}

export async function deleteSolvesBatch(dto: DeleteSolvesBatchDTO): Promise<Cube> {
  const { cubeId, solveIds, solveTab: tab } = dto
  const cube = await cubesDB.getById(cubeId)
  if (!cube) throw new Error('Cube not found')

  const list = tab.toLowerCase() === SolveTab.SESSION.toLowerCase() ? cube.solves.session : cube.solves.all
  const idSet = new Set(solveIds)
  const now = Date.now()

  for (let i = 0; i < list.length; i++) {
    if (idSet.has(list[i].id)) {
      list[i] = { ...list[i], updatedAt: now, isDeleted: true }
    }
  }

  return await cubesDB.update(cube)
}
