import { calcAoFromWindow } from '@nexustimer/stats'
import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'
import { mergeSolvesNewestFirst } from '@/entities/solve/lib/sortSolves'
import { findBestAoWindow } from '@/shared/lib/statistics/calcBestAo'

export const RECORD_SIZES = [1, 5, 12, 50, 100] as const

export type SolvesSummary = {
  count: number
  mean: number | null
  best: number | null
  worst: number | null
  dnf: number
  plus2: number
}

export type Distribution = {
  bins: number[]
  min: number
  max: number
  meanBin: number
}

export type AsideRecord = {
  size: number
  value: number
  at: number
  solve: Solve | null
  window: Solve[] | null
}

export function solveTimestamp(solve: Solve): number {
  return solve.endTime || solve.startTime
}

export function liveSolves(cube: Cube): Solve[] {
  return mergeSolvesNewestFirst([cube.solves.all, cube.solves.session]).filter((solve) => !solve.isDeleted)
}

export function summarizeSolves(solves: Solve[]): SolvesSummary {
  let best: number | null = null
  let worst: number | null = null
  let total = 0
  let valid = 0
  let dnf = 0
  let plus2 = 0

  for (const solve of solves) {
    if (solve.dnf) {
      dnf++
      continue
    }
    if (solve.plus2) plus2++
    valid++
    total += solve.time
    if (best === null || solve.time < best) best = solve.time
    if (worst === null || solve.time > worst) worst = solve.time
  }

  return { count: solves.length, mean: valid > 0 ? total / valid : null, best, worst, dnf, plus2 }
}

export function buildDistribution(solves: Solve[], binCount = 16, minSolves = 5): Distribution | null {
  const times = solves
    .filter((solve) => !solve.dnf)
    .map((solve) => solve.time)
    .sort((a, b) => a - b)
  if (times.length < minSolves) return null

  const trim = Math.floor(times.length * 0.02)
  const min = times[trim]
  const max = times[times.length - 1 - trim]
  const span = max - min
  const bins = new Array<number>(binCount).fill(0)
  const binOf = (time: number) =>
    span === 0
      ? Math.floor(binCount / 2)
      : Math.min(binCount - 1, Math.max(0, Math.floor(((time - min) / span) * binCount)))

  for (const time of times) bins[binOf(time)]++

  const mean = times.reduce((sum, time) => sum + time, 0) / times.length
  return { bins, min, max, meanBin: binOf(mean) }
}

export function findRecords(solves: Solve[]): AsideRecord[] {
  const records: AsideRecord[] = []

  for (const size of RECORD_SIZES) {
    if (size === 1) {
      let best: Solve | null = null
      for (const solve of solves) {
        if (!solve.dnf && (best === null || solve.time < best.time)) best = solve
      }
      if (best) records.push({ size, value: best.time, at: solveTimestamp(best), solve: best, window: null })
      continue
    }

    const window = findBestAoWindow(solves, size)
    if (!window) continue
    const value = calcAoFromWindow(window, size)
    if (value <= 0) continue
    records.push({ size, value, at: Math.max(...window.map(solveTimestamp)), solve: null, window })
  }

  return records
}

export type MonthMean = {
  start: number
  mean: number | null
  count: number
}

export function monthlySeries(solves: Solve[], now: number, months = 6): MonthMean[] {
  const date = new Date(now)
  const starts = Array.from({ length: months }, (_, index) =>
    new Date(date.getFullYear(), date.getMonth() - (months - 1 - index), 1).getTime()
  )
  const sums = new Array<number>(months).fill(0)
  const counts = new Array<number>(months).fill(0)

  for (const solve of solves) {
    if (solve.dnf) continue
    const at = solveTimestamp(solve)
    if (at < starts[0]) continue
    let index = months - 1
    while (index > 0 && at < starts[index]) index--
    sums[index] += solve.time
    counts[index]++
  }

  return starts.map((start, index) => ({
    start,
    mean: counts[index] > 0 ? sums[index] / counts[index] : null,
    count: counts[index]
  }))
}

export type CategoryShare = {
  category: string
  count: number
}

export function categoryBreakdown(cubes: Cube[]): CategoryShare[] {
  const counts = new Map<string, number>()
  for (const cube of cubes) {
    if (cube.isDeleted) continue
    counts.set(cube.category, (counts.get(cube.category) ?? 0) + liveSolves(cube).length)
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category))
}

export function categorySolves(cubes: Cube[], category: string): Solve[] {
  return mergeSolvesNewestFirst(cubes.filter((cube) => !cube.isDeleted && cube.category === category).map(liveSolves))
}
