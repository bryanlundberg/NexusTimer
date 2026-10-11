import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'

export function bestBefore(cubes: Cube[] | null, category: CubeCategory, current: Solve): number | null {
  let best = Infinity
  for (const cube of cubes ?? []) {
    if (cube.category !== category) continue
    for (const solve of [...cube.solves.all, ...cube.solves.session]) {
      if (solve.id !== current.id && !solve.isDeleted && !solve.dnf && solve.time < best) best = solve.time
    }
  }
  return best === Infinity ? null : best
}
