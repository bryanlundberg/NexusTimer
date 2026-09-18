import { database } from '@/shared/config/indexdb/indexdb'
import { Solve } from '@/entities/solve/model/types'
import { Cube } from '@/entities/cube/model/types'
import { reconcileCubeWrite } from '@/entities/cube/lib/reconcileCubeWrite'
import { normalizeCubeSolves } from '@/entities/cube/lib/normalizeCubeSolves'

const STORE_NAME = 'nx-data'
const Cubes = database.create(STORE_NAME)

export const cubesDB = {
  async getAll(): Promise<Cube[]> {
    const all = (await Cubes.find().get()) as Cube[]

    return all
      .filter((cube) => !cube.isDeleted)
      .map((cube) =>
        normalizeCubeSolves({
          ...cube,
          solves: cube.solves
            ? {
                session: cube.solves.session.filter((solve) => !solve?.isDeleted),
                all: cube.solves.all.filter((solve) => !solve?.isDeleted)
              }
            : cube.solves
        })
      )
  },

  async getAllDatabase(): Promise<Cube[]> {
    const all = (await Cubes.find().get()) as Cube[]
    return all.map(normalizeCubeSolves)
  },

  async getById(id: string): Promise<Cube> {
    const cube = await Cubes.get(id)
    if (!cube) throw new Error('Cube not found')
    if (cube.isDeleted) throw new Error('Cube deleted')

    return normalizeCubeSolves({
      ...cube,
      solves: {
        session: cube.solves.session.filter((solve: Solve) => !solve?.isDeleted),
        all: cube.solves.all.filter((solve: Solve) => !solve?.isDeleted)
      }
    })
  },

  async add(cube: Cube): Promise<Cube> {
    return await Cubes.add(normalizeCubeSolves(cube))
  },

  async update(cube: Cube) {
    const stored = (await Cubes.get(cube.id)) as Cube | undefined
    return await Cubes.put({ ...normalizeCubeSolves(reconcileCubeWrite(stored, cube)), updatedAt: Date.now() })
  },

  async replaceAll(cubes: Cube[]) {
    await Cubes.replaceAll(cubes.map(normalizeCubeSolves))
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
      const moved = sameCategoryCube.solves.session.map((solve) => {
        return { ...solve, updatedAt: Date.now(), isDeleted: !!solve.isDeleted }
      })

      sameCategoryCube.solves.all = [...sameCategoryCube.solves.all, ...moved]
      sameCategoryCube.solves.session = []
      await this.update(sameCategoryCube)
    }
  }
}
