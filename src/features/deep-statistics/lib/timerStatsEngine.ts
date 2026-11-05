import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'
import { compareNewestFirst, isSortedNewestFirst } from '@/entities/solve/lib/sortSolves'
import getSolvesMetrics from '@/shared/lib/statistics/getSolvesMetrics'
import calcCurrentAo from '@/shared/lib/statistics/calcCurrentAo'
import { calcBestAos } from '@/shared/lib/statistics/calcBestAo'
import { calcAoFromWindow } from '@/shared/lib/statistics/getAoTolerance'
import getDeviation from '@/shared/lib/statistics/getDeviation'
import { defaultTimerStatistics } from '@/shared/model/timer/defaultTimerStatistics'
import { CubeStatistics, DisplayTimerStatistics } from '@/features/deep-statistics/model/types'

const AO_SIZES = [3, 5, 12, 50, 100]
const KINDS = ['global', 'session', 'cubeSession'] as const
type Kind = (typeof KINDS)[number]

type Aggregate = { validCount: number; hasDnf: boolean; best: number; worst: number; sum: number; exact: boolean }
type ListState = { solves: Solve[]; aggregate: Aggregate; aos: number[] }

export type TimerStatsState = {
  cubes: Cube[]
  selectedCube: Cube
  incremental: boolean
  sizes: number[]
  lists: Record<Kind, ListState>
  result: DisplayTimerStatistics
}

const emptyResult = (): DisplayTimerStatistics => ({
  global: defaultTimerStatistics,
  session: defaultTimerStatistics,
  cubeSession: defaultTimerStatistics
})

function aggregate(solves: Solve[], base?: Aggregate): Aggregate {
  const out: Aggregate = base
    ? { ...base }
    : { validCount: 0, hasDnf: false, best: Infinity, worst: -Infinity, sum: 0, exact: true }
  let sum = 0
  for (const solve of solves) {
    if (solve.dnf) {
      out.hasDnf = true
      continue
    }
    out.validCount++
    if (solve.time < out.best) out.best = solve.time
    if (solve.time > out.worst) out.worst = solve.time
    sum += solve.time
    if (out.exact && !Number.isInteger(solve.time)) out.exact = false
  }
  out.sum = base ? sum + base.sum : sum
  return out
}

function toStatistics(list: ListState, sizes: number[]): CubeStatistics {
  const { solves, aggregate: agg, aos } = list
  if (solves.length === 0) return defaultTimerStatistics
  return {
    count: solves.length,
    best: agg.validCount > 0 ? agg.best : 0,
    deviation: getDeviation(solves),
    mean: agg.validCount === 0 ? 0 : agg.sum / agg.validCount,
    worst: agg.hasDnf || agg.validCount === 0 ? 0 : agg.worst,
    ...Object.fromEntries(sizes.map((size, index) => [`ao${size}`, aos[index]]))
  }
}

function currentAos(solves: Solve[], sizes: number[]): number[] {
  return sizes.map((ao) => calcCurrentAo(solves, ao))
}

function fullList(kind: Kind, solves: Solve[], sizes: number[]): ListState {
  return {
    solves,
    aggregate: aggregate(solves),
    aos: kind === 'global' ? calcBestAos(solves, sizes) : currentAos(solves, sizes)
  }
}

function appendedBestAos(previous: ListState, solves: Solve[], added: number, sizes: number[]): number[] {
  return sizes.map((ao, index) => {
    if (previous.solves.length < ao) return calcBestAos(solves, [ao])[0]
    let candidate = Infinity
    for (let i = 0; i < added && i + ao <= solves.length; i++) {
      const value = calcAoFromWindow(solves.slice(i, i + ao), ao)
      if (value > 0 && value < candidate) candidate = value
    }
    return Math.min(previous.aos[index], candidate)
  })
}

function appendedList(kind: Kind, previous: ListState, added: Solve[], sizes: number[]): ListState {
  const solves = [...added, ...previous.solves]
  const next = aggregate(added, previous.aggregate)
  const agg = next.exact ? next : aggregate(solves)
  return {
    solves,
    aggregate: agg,
    aos: kind === 'global' ? appendedBestAos(previous, solves, added.length, sizes) : currentAos(solves, sizes)
  }
}

function targetCubeId(cubes: Cube[], selectedCube: Cube): string | undefined {
  let id: string | undefined
  for (const cube of cubes) {
    if (cube.category === selectedCube.category && cube.name === selectedCube.name) id = cube.id
  }
  return id
}

export function createTimerStats(
  cubes: Cube[] | null,
  selectedCube: Cube | null,
  sizes: number[] = AO_SIZES
): TimerStatsState | null {
  if (!selectedCube) return null
  const all = cubes ?? []
  const metrics = getSolvesMetrics({ cubesDB: all, category: selectedCube.category, cubeName: selectedCube.name })
  const lists = {
    global: fullList('global', metrics.global, sizes),
    session: fullList('session', metrics.session, sizes),
    cubeSession: fullList('cubeSession', metrics.cubeSession, sizes)
  }
  return {
    cubes: all,
    selectedCube,
    incremental: targetCubeId(all, selectedCube) === selectedCube.id,
    sizes,
    lists,
    result: {
      global: toStatistics(lists.global, sizes),
      session: toStatistics(lists.session, sizes),
      cubeSession: toStatistics(lists.cubeSession, sizes)
    }
  }
}

export function appendTimerStats(state: TimerStatsState, cubeId: string, added: Solve[]): TimerStatsState | null {
  if (cubeId !== state.selectedCube.id) return null

  const selectedCube: Cube = {
    ...state.selectedCube,
    solves: { ...state.selectedCube.solves, session: [...added, ...state.selectedCube.solves.session] }
  }
  const cubes = state.cubes.map((cube) => (cube.id === cubeId ? selectedCube : cube))
  const live = added.filter((solve) => !solve.isDeleted)

  const canAppend =
    state.incremental &&
    live.length === added.length &&
    isSortedNewestFirst(live) &&
    KINDS.every((kind) => {
      const head = state.lists[kind].solves[0]
      return !head || live.length === 0 || compareNewestFirst(live[live.length - 1], head) <= 0
    })

  const { sizes } = state
  if (!canAppend) return createTimerStats(cubes, selectedCube, sizes)

  const lists = {
    global: appendedList('global', state.lists.global, live, sizes),
    session: appendedList('session', state.lists.session, live, sizes),
    cubeSession: appendedList('cubeSession', state.lists.cubeSession, live, sizes)
  }
  return {
    cubes,
    selectedCube,
    incremental: true,
    sizes,
    lists,
    result: {
      global: toStatistics(lists.global, sizes),
      session: toStatistics(lists.session, sizes),
      cubeSession: toStatistics(lists.cubeSession, sizes)
    }
  }
}

export function timerStatsResult(state: TimerStatsState | null): DisplayTimerStatistics {
  return state ? state.result : emptyResult()
}
