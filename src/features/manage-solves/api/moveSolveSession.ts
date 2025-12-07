import { MoveSolveSessionDTO } from '@/features/manage-solves/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { SolveTab } from '@/shared/types/enums'
import { findIndex } from 'es-toolkit/compat'

export default async function moveSolveSession(dto: MoveSolveSessionDTO) {
  const { cubeId, solveId, fromTab } = dto

  const cube = await cubesDB.getById(cubeId)
  if (!cube) throw new Error('Cube not found')

  const fromList = fromTab.toLowerCase() === SolveTab.SESSION ? cube.solves.session : cube.solves.all
  const toList = fromTab.toLowerCase() === SolveTab.SESSION ? cube.solves.all : cube.solves.session

  const idx = findIndex(fromList, (solve) => solve.id === solveId)
  if (idx === -1) throw new Error('Solve not found in the specified tab')

  const solve = fromList[idx]
  solve.updatedAt = Date.now()
  solve.isDeleted = true

  const existingIdx = findIndex(toList, (solve) => solve.id === solveId)
  if (existingIdx >= 0) {
    toList[existingIdx] = { ...solve, isDeleted: false, updatedAt: Date.now() + 1 }
  } else {
    toList.push({ ...solve, isDeleted: false, updatedAt: Date.now() + 1 })
  }

  return await cubesDB.update(cube)
}
