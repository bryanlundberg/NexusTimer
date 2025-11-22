import type { Cube } from '../model/types'

export function filterCubes(backup?: Cube[] | null): Cube[] {
  const list = backup || []
  return list.filter((cube) => {
    if ((cube as any).isDeleted) return false
    const allSolves = cube.solves.all.filter((solve) => !solve.isDeleted)
    const allSessions = cube.solves.session.filter((solve) => !solve.isDeleted)
    cube.solves.all = allSolves
    cube.solves.session = allSessions
    return true
  })
}
