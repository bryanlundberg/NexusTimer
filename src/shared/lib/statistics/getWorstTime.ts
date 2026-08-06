import { Solve } from '@/entities/solve/model/types'

export default function getWorstTime(solves: Solve[]): number {
  if (!solves || solves.length === 0) return 0

  const validSolves = solves.filter((solve) => !solve.dnf)
  if (validSolves.length === 0) return 0

  const sortSolves = [...validSolves].sort((a, b) => b.time - a.time)
  return sortSolves[0].time
}
