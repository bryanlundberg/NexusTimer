import { useMemo } from 'react'
import type { Cube } from '@/entities/cube/model/types'
import type { Solve } from '@/entities/solve/model/types'
import calcCurrentAo from '@/shared/lib/statistics/calcCurrentAo'

const RECENT_LIMIT = 40

export interface CurrentAverage {
  value: number | null
  isDnf: boolean
}

function currentAverage(solves: Solve[], size: number): CurrentAverage {
  if (solves.length < size) return { value: null, isDnf: false }
  const value = calcCurrentAo(solves, size)
  return value === 0 ? { value: null, isDnf: true } : { value, isDnf: false }
}

export function useCubeSolveSummary(cube: Cube) {
  return useMemo(() => {
    const byId = new Map<string, Solve>()
    cube.solves.all.forEach((solve) => byId.set(solve.id, solve))
    cube.solves.session.forEach((solve) => byId.set(solve.id, solve))
    const live = [...byId.values()].filter((solve) => !solve.isDeleted)
    const bestTime = live.reduce<number | null>(
      (min, solve) => (!solve.dnf && (min === null || solve.time < min) ? solve.time : min),
      null
    )
    const recentSolves = live.sort((a, b) => b.endTime - a.endTime).slice(0, RECENT_LIMIT)
    const ao12 = currentAverage(recentSolves, 12)
    const previousAo12 = currentAverage(recentSolves.slice(12), 12)
    const ao12Delta = ao12.value !== null && previousAo12.value !== null ? ao12.value - previousAo12.value : null

    return {
      uniqueSolves: byId.size,
      recentSolves,
      bestTime,
      ao5: currentAverage(recentSolves, 5),
      ao12,
      ao12Delta,
      lastSolveAt: recentSolves[0]?.endTime ?? null
    }
  }, [cube])
}
