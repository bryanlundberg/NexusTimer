import { database } from '@/db/indexdb'
import { Solve } from '@/entities/solve/model/types'
import { Cube } from '@/entities/cube/model/types'

const STORE_NAME = 'nx-data'
const Cubes = database.create(STORE_NAME)

export const cubesDB = {
  async getAll(): Promise<Cube[]> {
    const all = await Cubes.find().get()
    return all.filter((cube) => !cube.isDeleted)
  },

  async getAllDatabase(): Promise<Cube[]> {
    return await Cubes.find().get()
  },

  async getById(id: string): Promise<Cube> {
    const cube = await Cubes.get(id)
    if (cube?.isDeleted) throw new Error('Cube deleted')
    if (!cube) throw new Error('Cube not found')

    cube.solves.session.filter((solve: Solve) => !solve?.isDeleted)
    cube.solves.all.filter((solve: Solve) => !solve?.isDeleted)

    return cube
  },

  async add(cube: Cube) {
    return await Cubes.add(cube)
  },

  async update(cube: Cube) {
    return await Cubes.put(cube)
  }
}
