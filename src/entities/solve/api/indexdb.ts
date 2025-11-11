import { Solve } from '@/entities/solve/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/config/cube-categories'
import { SolveTab } from '@/enums/SolveTab'

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
    // TODO: Finish implementation
  },

  async updateById(cubeId: string, solveId: string, patch: Solve, tab: SolveTab): Promise<Cube> {
    const cube = await cubesDB.getById(cubeId)
    if (!cube) throw new Error('Cube not found')
    const list = tab === SolveTab.SESSION ? cube.solves.session : cube.solves.all
    const idx = list.findIndex((s) => s.id === solveId)
    if (idx === -1) throw new Error('Solve not found')
    list[idx] = { ...list[idx], ...patch, updatedAt: Date.now() }
    return await cubesDB.update(cube)
  },

  async toggleDNFById(cubeId: string, solveId: string, dnf: boolean, tab: SolveTab): Promise<Cube> {
    const cube = await cubesDB.getById(cubeId)
    if (!cube) throw new Error('Cube not found')
    const list = tab === SolveTab.SESSION ? cube.solves.session : cube.solves.all
    const idx = list.findIndex((s) => s.id === solveId)
    if (idx === -1) throw new Error('Solve not found')

    const previousPlus2 = list[idx].plus2

    if (previousPlus2) {
      list[idx].plus2 = false
      list[idx].time -= 2000
    }

    list[idx].dnf = dnf
    list[idx].updatedAt = Date.now()
    return await cubesDB.update(cube)
  },

  async togglePlus2ById(cubeId: string, solveId: string, plus2: boolean, tab: SolveTab): Promise<Cube> {
    const cube = await cubesDB.getById(cubeId)
    if (!cube) throw new Error('Cube not found')
    const list = tab === SolveTab.SESSION ? cube.solves.session : cube.solves.all
    const idx = list.findIndex((s) => s.id === solveId)
    if (idx === -1) throw new Error('Solve not found')

    const previousDNF = list[idx].dnf
    const previousPlus2 = list[idx].plus2

    if (previousDNF) {
      list[idx].dnf = false
    }

    if (previousPlus2) {
      list[idx].time -= 2000
      list[idx].plus2 = false
      list[idx].updatedAt = Date.now()
      return await cubesDB.update(cube)
    }

    list[idx].time += 2000
    list[idx].plus2 = plus2
    list[idx].updatedAt = Date.now()
    return await cubesDB.update(cube)
  },

  async toggleBookmarkById(cubeId: string, solveId: string, bookmark: boolean, tab: SolveTab): Promise<Cube> {
    const cube = await cubesDB.getById(cubeId)
    if (!cube) throw new Error('Cube not found')
    const list = tab === SolveTab.SESSION ? cube.solves.session : cube.solves.all
    const idx = list.findIndex((s) => s.id === solveId)
    if (idx === -1) throw new Error('Solve not found')
    list[idx].bookmark = bookmark
    list[idx].updatedAt = Date.now()
    return await cubesDB.update(cube)
  },

  async deleteById(cubeId: string, solveId: string, tab: SolveTab): Promise<Cube> {
    const cube = await cubesDB.getById(cubeId)
    if (!cube) throw new Error('Cube not found')
    const list = tab === SolveTab.SESSION ? cube.solves.session : cube.solves.all
    const idx = list.findIndex((s) => s.id === solveId)
    if (idx === -1) throw new Error('Solve not found')
    list[idx] = { ...list[idx], updatedAt: Date.now(), isDeleted: true }
    return await cubesDB.update(cube)
  }
}
