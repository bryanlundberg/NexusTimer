import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'

/**
 * Reconcile the same solve id appearing across DIFFERENT cubes.
 */
export function reconcileSolvesAcrossCubes(cubes: Cube[]): Cube[] {
  const metric = (solve: Solve) => ({ updatedAt: solve.updatedAt ?? 0, isDeleted: solve.isDeleted ?? false })

  // Pass 1: find the winning (updatedAt, isDeleted) per solve id across every cube/bucket.
  const best = new Map<string, { updatedAt: number; isDeleted: boolean }>()
  const consider = (solve: Solve) => {
    const { updatedAt, isDeleted } = metric(solve)
    const current = best.get(solve.id)
    const wins =
      !current || updatedAt > current.updatedAt || (updatedAt === current.updatedAt && current.isDeleted && !isDeleted)
    if (wins) best.set(solve.id, { updatedAt, isDeleted })
  }
  for (const cube of cubes) {
    cube.solves.session.forEach(consider)
    cube.solves.all.forEach(consider)
  }

  // Pass 2: award exactly one winner per id (first match in traversal order); delete the rest.
  const awarded = new Set<string>()
  const resolve = (solve: Solve): Solve => {
    const winner = best.get(solve.id)!
    const { updatedAt, isDeleted } = metric(solve)
    if (!awarded.has(solve.id) && updatedAt === winner.updatedAt && isDeleted === winner.isDeleted) {
      awarded.add(solve.id)
      return solve
    }
    return solve.isDeleted ? solve : { ...solve, isDeleted: true }
  }

  return cubes.map((cube) => ({
    ...cube,
    solves: {
      session: cube.solves.session.map(resolve),
      all: cube.solves.all.map(resolve)
    }
  }))
}
