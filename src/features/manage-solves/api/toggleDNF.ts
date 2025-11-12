import { Cube } from '@/entities/cube/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { ToggleDNFSolveDTO } from '@/features/manage-solves/model/types'
import { SolveTab } from '@/shared/types/enums'

export async function toggleDNF(dto: ToggleDNFSolveDTO): Promise<Cube> {
  const { cubeId, solveId, dnf, solveTab: tab } = dto

  const cube = await cubesDB.getById(cubeId)
  if (!cube) throw new Error('Cube not found')

  const list =
    tab.toLowerCase() === SolveTab.SESSION.toLowerCase()
      ? cube.solves.session.filter((solve) => !solve.isDeleted)
      : cube.solves.all.filter((solve) => !solve.isDeleted)

  const idx = list.findIndex((s) => s.id === solveId)
  if (idx === -1) throw new Error('Solve not found')

  const previousPlus2 = list[idx].plus2

  if (previousPlus2) {
    list[idx].plus2 = false
    list[idx].time -= 2000
  }

  if (tab.toLowerCase() === SolveTab.SESSION.toLowerCase()) {
    cube.solves.session = list
  } else {
    cube.solves.all = list
  }

  const solveToUpdate = list[idx]
  solveToUpdate.dnf = dnf
  solveToUpdate.updatedAt = Date.now()

  return await cubesDB.update(cube)
}
