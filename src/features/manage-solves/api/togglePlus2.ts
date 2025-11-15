import { Cube } from '@/entities/cube/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { TogglePlus2SolveDTO } from '@/features/manage-solves/model/types'
import { SolveTab } from '@/shared/types/enums'

export async function togglePlus2(dto: TogglePlus2SolveDTO): Promise<Cube> {
  const { cubeId, solveId, plus2, solveTab: tab } = dto
  const cube = await cubesDB.getById(cubeId)
  if (!cube) throw new Error('Cube not found')
  const list = tab.toLowerCase() === SolveTab.SESSION.toLowerCase() ? cube.solves.session : cube.solves.all
  const idx = list.findIndex((s) => s.id === solveId)
  if (idx === -1) throw new Error('Solve not found')

  const previousDNF = list[idx].dnf
  const previousPlus2 = list[idx].plus2

  if (previousDNF) {
    list[idx].dnf = false
  }

  if (previousPlus2) {
    list[idx].time -= 2000
    list[idx].plus2 = false
    list[idx].updatedAt = Date.now()
    return await cubesDB.update(cube)
  }

  list[idx].time += 2000
  list[idx].plus2 = plus2
  list[idx].updatedAt = Date.now()
  return await cubesDB.update(cube)
}
