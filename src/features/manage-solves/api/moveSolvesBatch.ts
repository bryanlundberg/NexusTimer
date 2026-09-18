import { SolveTab } from '@/shared/types/enums'
import { Cube } from '@/entities/cube/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { findIndex } from 'es-toolkit/compat'

interface MoveSolvesBatchDTO {
  cubeId: string
  solveIds: string[]
  fromTab: SolveTab
}

export async function moveSolvesBatch(dto: MoveSolvesBatchDTO): Promise<Cube> {
  const { cubeId, solveIds, fromTab } = dto
  const cube = await cubesDB.getById(cubeId)
  if (!cube) throw new Error('Cube not found')

  const fromList = fromTab.toLowerCase() === SolveTab.SESSION ? cube.solves.session : cube.solves.all
  const toList = fromTab.toLowerCase() === SolveTab.SESSION ? cube.solves.all : cube.solves.session
  const idSet = new Set(solveIds)
  const now = Date.now()

  for (const solve of fromList) {
    if (!idSet.has(solve.id)) continue

    solve.updatedAt = now
    solve.isDeleted = true

    const existingIdx = findIndex(toList, (s) => s.id === solve.id)
    if (existingIdx >= 0) {
      toList[existingIdx] = { ...solve, isDeleted: false, updatedAt: now + 1 }
    } else {
      toList.push({ ...solve, isDeleted: false, updatedAt: now + 1 })
    }
  }

  return await cubesDB.update(cube)
}
