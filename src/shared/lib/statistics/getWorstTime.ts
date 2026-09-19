import { Solve } from '@/entities/solve/model/types'

export default function getWorstTime(solves: Solve[]): number {
  if (!solves || solves.length === 0) return 0

  let worst = -Infinity
  for (const solve of solves) {
    if (!solve.dnf && solve.time > worst) worst = solve.time
  }
  return worst === -Infinity ? 0 : worst
}
