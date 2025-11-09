import { database } from '@/db/indexdb'
import { Cube } from '@/interfaces/Cube'

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

  async getById(id: string): Promise<Cube | null> {
    return await Cubes.get(id)
  },

  async add(cube: Cube) {
    return await Cubes.add(cube)
  },

  async update(cube: Cube) {
    return await Cubes.put(cube)
  }
}
