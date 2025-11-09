import { Solve } from '@/entities/solve/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/config/cube-categories'

export const solvesDB = {
  async addToSession(solve: Solve): Promise<Cube> {
    const cube = await cubesDB.getById(solve.cubeId)
    if (!cube) throw new Error('Cube not found')
    cube.solves.session.push(solve)
    return await cubesDB.update(cube)
  },

  async addToAll(solve: Solve): Promise<Cube> {
    const cube = await cubesDB.getById(solve.cubeId)
    if (!cube) throw new Error('Cube not found')
    cube.solves.all.push(solve)
    return await cubesDB.update(cube)
  },

  async closeSession(category: CubeCategory): Promise<void> {
    const cubes = await cubesDB.getAll()
  }
}
