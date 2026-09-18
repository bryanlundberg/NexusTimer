import { database } from '@/shared/config/indexdb/indexdb'
import { Solve } from '@/entities/solve/model/types'
import { Cube } from '@/entities/cube/model/types'
import { reconcileCubeWrite } from '@/entities/cube/lib/reconcileCubeWrite'
import { normalizeCubeSolves } from '@/entities/cube/lib/normalizeCubeSolves'

const STORE_NAME = 'nx-data'
const Cubes = database.create(STORE_NAME)

function toLiveCube(cube: Cube): Cube {
  if (!cube.solves) return cube
  return normalizeCubeSolves({
    ...cube,
    solves: {
      session: cube.solves.session.filter((solve: Solve) => !solve?.isDeleted),
      all: cube.solves.all.filter((solve: Solve) => !solve?.isDeleted)
    }
  })
}

export const cubesDB = {
  async getAll(): Promise<Cube[]> {
    const all = (await Cubes.find().get()) as Cube[]

    return all.filter((cube) => !cube.isDeleted).map(toLiveCube)
  },

  async getAllDatabase(): Promise<Cube[]> {
    const all = (await Cubes.find().get()) as Cube[]
    return all.map(normalizeCubeSolves)
  },

  async getById(id: string): Promise<Cube> {
    const cube = await Cubes.get(id)
    if (!cube) throw new Error('Cube not found')
    if (cube.isDeleted) throw new Error('Cube deleted')

    return toLiveCube(cube)
  },

  async add(cube: Cube): Promise<Cube> {
    return await Cubes.add(normalizeCubeSolves(cube))
  },

  async update(cube: Cube): Promise<Cube> {
    const stored = (await Cubes.get(cube.id)) as Cube | undefined
    const next = { ...normalizeCubeSolves(reconcileCubeWrite(stored, cube)), updatedAt: Date.now() }
    await Cubes.put(next)
    return toLiveCube(next)
  },

  async replaceAll(cubes: Cube[]): Promise<Cube[]> {
    const normalized = cubes.map(normalizeCubeSolves)
    await Cubes.replaceAll(normalized)
    return normalized
      .filter((cube) => !cube.isDeleted)
      .map(toLiveCube)
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  },

  async clear(): Promise<void> {
    return await Cubes.clear()
  },

  async endSessionForCube(cube: Cube): Promise<Cube[]> {
    const dbCube = await this.getById(cube.id)
    if (!dbCube) return []

    const allCubes = await this.getAll()
    const sameCategoryCubes = allCubes.filter((c) => c.category === cube.category)

    const updated: Cube[] = []
    for (const sameCategoryCube of sameCategoryCubes) {
      if (sameCategoryCube.solves.session.length === 0) continue
      const moved = sameCategoryCube.solves.session.map((solve) => {
        return { ...solve, updatedAt: Date.now(), isDeleted: !!solve.isDeleted }
      })

      sameCategoryCube.solves.all = [...sameCategoryCube.solves.all, ...moved]
      sameCategoryCube.solves.session = []
      updated.push(await this.update(sameCategoryCube))
    }
    return updated
  }
}
