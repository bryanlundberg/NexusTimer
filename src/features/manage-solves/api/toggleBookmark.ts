import { Cube } from '@/entities/cube/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { ToggleBookmarkSolveDTO } from '@/features/manage-solves/model/types'
import { SolveTab } from '@/shared/types/enums'

export async function toggleBookmark(dto: ToggleBookmarkSolveDTO): Promise<Cube> {
  const { cubeId, solveId, bookmark, solveTab: tab } = dto
  const cube = await cubesDB.getById(cubeId)
  if (!cube) throw new Error('Cube not found')
  const list = tab.toLowerCase() === SolveTab.SESSION.toLowerCase() ? cube.solves.session : cube.solves.all
  const idx = list.findIndex((s) => s.id === solveId)
  if (idx === -1) throw new Error('Solve not found')
  list[idx].bookmark = bookmark
  list[idx].updatedAt = Date.now()
  return await cubesDB.update(cube)
}
