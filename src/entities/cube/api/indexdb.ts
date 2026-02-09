import _ from 'lodash'
import { database } from '@/shared/config/indexdb/indexdb'
import { Solve } from '@/entities/solve/model/types'
import { Cube } from '@/entities/cube/model/types'

const STORE_NAME = 'nx-data'
const Cubes = database.create(STORE_NAME)

export const cubesDB = {
  async getAll(): Promise<Cube[]> {
    const all = (await Cubes.find().get()) as Cube[]

    return all
      .map((cube) => {
        const cubeCopy = _.cloneDeep(cube)
        if (cubeCopy.solves) {
          cubeCopy.solves.session = cubeCopy.solves.session.filter((solve) => !solve?.isDeleted)
          cubeCopy.solves.all = cubeCopy.solves.all.filter((solve) => !solve?.isDeleted)
        }
        return cubeCopy
      })
      .filter((cube) => !cube.isDeleted)
  },

  async getAllDatabase(): Promise<Cube[]> {
    return await Cubes.find().get()
  },

  async getById(id: string): Promise<Cube> {
    const cube = await Cubes.get(id)
    if (!cube) throw new Error('Cube not found')
    if (cube.isDeleted) throw new Error('Cube deleted')

    const cubeCopy = _.cloneDeep(cube)
    cubeCopy.solves.session = cubeCopy.solves.session.filter((solve: Solve) => !solve?.isDeleted)
    cubeCopy.solves.all = cubeCopy.solves.all.filter((solve: Solve) => !solve?.isDeleted)

    return cubeCopy
  },

  async add(cube: Cube): Promise<Cube> {
    return await Cubes.add(cube)
  },

  async update(cube: Cube) {
    return await Cubes.put(cube)
  },

  async saveBatch(cubesBatch: Cube[]) {
    for (const cube of cubesBatch) {
      await Cubes.put(cube)
    }
  },

  async clear(): Promise<void> {
    return await Cubes.clear()
  },

  async endSessionForCube(cube: Cube): Promise<void> {
    const dbCube = await this.getById(cube.id)
    if (!dbCube) return

    const allCubes = await this.getAll()
    const sameCategoryCubes = allCubes.filter((c) => c.category === cube.category)

    for (const sameCategoryCube of sameCategoryCubes) {
      sameCategoryCube.solves.all.push(
        ...sameCategoryCube.solves.session.map((solve) => {
          return { ...solve, updatedAt: Date.now(), isDeleted: !!solve.isDeleted }
        })
      )

      sameCategoryCube.solves.session = []
      await this.update(sameCategoryCube)
    }
  }
}
