import { DeleteSolveDTO } from '@/features/manage-solves/model/types'
import { solvesDB } from '@/entities/solve/api/indexdb'

export default async function deleteSolve(dto: DeleteSolveDTO) {
  const { cubeId, solveId, solveTab } = dto
  return await solvesDB.deleteById(cubeId, solveId, solveTab)
}
