import { groupBy, minBy, orderBy } from 'es-toolkit'
import type { Cube } from '@/entities/cube/model/types'
import type { Solve } from '@/entities/solve/model/types'
import { computeSolveStats } from '@/entities/achievement/model/achievements'
import { serializeSolveStats } from '@/entities/user-stats/lib/solve-stats-serialization'
import { mergeSolvesNewestFirst } from '@/entities/solve/lib/sortSolves'
import calcBestAo, { findBestAoWindow } from '@/shared/lib/statistics/calcBestAo'
import { getCategoryOrder, type CubeCategory } from '@/shared/const/cube-categories'
import {
  RECENT_SOLVES_LIMIT,
  USER_STATS_VERSION,
  type CategoryStats,
  type CubeStats,
  type RecentSolve,
  type UserStatsSummary
} from '@/entities/user-stats/model/types'

type TaggedSolve = Solve & { category: CubeCategory; cubeName: string }

const validAo = (ms: number) => Number.isFinite(ms) && ms > 0

function tagSolves(cubes: Cube[]): TaggedSolve[] {
  const tag = (cube: Cube, solves: Solve[]) =>
    solves.map((solve) => ({ ...solve, category: cube.category, cubeName: cube.name }))

  return [
    ...cubes.flatMap((cube) => tag(cube, cube.solves.session)),
    ...cubes.flatMap((cube) => tag(cube, cube.solves.all))
  ].filter((solve) => !solve.isDeleted)
}

function categoryStats(category: CubeCategory, solves: TaggedSolve[]): CategoryStats {
  const ordered = orderBy(solves, [(solve) => solve.endTime], ['asc'])
  const valid = solves.filter((solve) => !solve.dnf)
  const best = valid.length > 0 ? minBy(valid, (solve) => solve.time) : undefined

  const ao5 = calcBestAo(ordered, 5)
  const window = validAo(ao5) ? findBestAoWindow(ordered, 5) : null
  const last = window?.[window.length - 1]

  return {
    category,
    count: solves.length,
    best: best ? { time: best.time, cubeName: best.cubeName, endTime: best.endTime } : null,
    bestAo5:
      window && last
        ? {
            time: ao5,
            cubeName: last.cubeName,
            endTime: last.endTime,
            window: window.map(({ id, time, dnf, plus2 }) => ({ id, time, dnf, plus2 }))
          }
        : null
  }
}

function cubeStats(cube: Cube): CubeStats {
  const solves = mergeSolvesNewestFirst([cube.solves.all || [], cube.solves.session || []]).filter(
    (solve) => !solve.isDeleted
  )

  const counts = { ok: 0, plus2: 0, dnf: 0 }
  let totalTime = 0
  let best = Infinity
  for (const solve of solves) {
    if (solve.dnf) counts.dnf++
    else if (solve.plus2) counts.plus2++
    else counts.ok++
    if (!solve.dnf && solve.time < best) best = solve.time
    totalTime += solve.time || 0
  }

  const ao5 = calcBestAo(solves, 5)

  return {
    id: cube.id,
    name: cube.name,
    category: cube.category,
    createdAt: cube.createdAt,
    best: Number.isFinite(best) ? best : null,
    bestAo5: validAo(ao5) ? ao5 : null,
    totalTime,
    counts
  }
}

function recentSolves(solves: TaggedSolve[]): RecentSolve[] {
  return orderBy(solves, ['startTime'], ['desc'])
    .slice(0, RECENT_SOLVES_LIMIT)
    .map(({ id, time, startTime, scramble, dnf, plus2, category, cubeName }) => ({
      id,
      time,
      startTime,
      scramble,
      dnf: Boolean(dnf),
      plus2: Boolean(plus2),
      category,
      cubeName
    }))
}

export function computeUserStats(cubes: Cube[], timezone: string): UserStatsSummary {
  const solves = tagSolves(cubes)
  const byCategory = groupBy(solves, (solve) => solve.category)

  const categories = orderBy(
    Object.entries(byCategory).map(([category, list]) => categoryStats(category as CubeCategory, list)),
    [(stats) => getCategoryOrder(stats.category)],
    ['asc']
  )

  return {
    version: USER_STATS_VERSION,
    timezone,
    totalSolves: solves.length,
    categories,
    cubes: cubes.map(cubeStats),
    recentSolves: recentSolves(solves),
    achievements: {
      solveStats: serializeSolveStats(computeSolveStats(cubes, timezone)),
      cubeCount: cubes.length
    }
  }
}
