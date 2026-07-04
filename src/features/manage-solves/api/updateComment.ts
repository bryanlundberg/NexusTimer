import { Cube } from '@/entities/cube/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { UpdateCommentSolveDTO } from '@/features/manage-solves/model/types'
import { SolveTab } from '@/shared/types/enums'

export async function updateComment(dto: UpdateCommentSolveDTO): Promise<Cube> {
  const { cubeId, solveId, comment, solveTab: tab } = dto

  const cube = await cubesDB.getById(cubeId)
  if (!cube) throw new Error('Cube not found')

  const list = tab.toLowerCase() === SolveTab.SESSION.toLowerCase() ? cube.solves.session : cube.solves.all
  const idx = list.findIndex((s) => s.id === solveId)
  if (idx === -1) throw new Error('Solve not found')

  list[idx].comment = comment
  list[idx].updatedAt = Date.now()

  return await cubesDB.update(cube)
}
