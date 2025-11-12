import { SolveTab } from '@/shared/types/enums'
import { Cube } from '@/entities/cube/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { DeleteSolveDTO } from '@/features/manage-solves/model/types'

export async function deleteSolve(dto: DeleteSolveDTO): Promise<Cube> {
  const { cubeId, solveId, solveTab: tab } = dto
  const cube = await cubesDB.getById(cubeId)
  if (!cube) throw new Error('Cube not found')
  const list = tab.toLowerCase() === SolveTab.SESSION.toLowerCase() ? cube.solves.session : cube.solves.all
  const idx = list.findIndex((s) => s.id === solveId)
  if (idx === -1) throw new Error('Solve not found')
  list[idx] = { ...list[idx], updatedAt: Date.now(), isDeleted: true }
  return await cubesDB.update(cube)
}
