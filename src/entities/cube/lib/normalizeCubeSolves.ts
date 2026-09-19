import { Cube } from '@/entities/cube/model/types'
import { sortSolvesNewestFirst } from '@/entities/solve/lib/sortSolves'

export function normalizeCubeSolves<T extends Cube>(cube: T): T {
  if (!cube?.solves) return cube
  const session = sortSolvesNewestFirst(cube.solves.session ?? [])
  const all = sortSolvesNewestFirst(cube.solves.all ?? [])
  if (session === cube.solves.session && all === cube.solves.all) return cube
  return { ...cube, solves: { ...cube.solves, session, all } }
}
