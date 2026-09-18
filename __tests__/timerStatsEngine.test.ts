import type { Cube } from '@/entities/cube/model/types'
import type { Solve } from '@/entities/solve/model/types'
import type { CubeStatistics } from '@/features/deep-statistics/model/types'
import {
  appendTimerStats,
  createTimerStats,
  TimerStatsState,
  timerStatsResult
} from '@/features/deep-statistics/lib/timerStatsEngine'
import { detectSessionAppend } from '@/features/deep-statistics/lib/detectSessionAppend'
import getSolvesMetrics from '@/shared/lib/statistics/getSolvesMetrics'
import getDeviation from '@/shared/lib/statistics/getDeviation'
import getMean from '@/shared/lib/statistics/getMean'
import calcCurrentAo from '@/shared/lib/statistics/calcCurrentAo'
import { calcAoFromWindow } from '@/shared/lib/statistics/getAoTolerance'
import { defaultTimerStatistics } from '@/shared/model/timer/defaultTimerStatistics'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'

function rng(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function legacyBestAo(solves: Solve[], ao: number): number {
  if (solves.length < ao || ao < 3) return 0
  let best = Infinity
  for (let i = 0; i + ao <= solves.length; i++) {
    const value = calcAoFromWindow(solves.slice(i, i + ao), ao)
    if (value > 0 && value < best) best = value
  }
  return best
}

function legacyList(solves: Solve[], type: string): CubeStatistics {
  if (solves.length === 0) return defaultTimerStatistics
  const valid = solves.filter((solve) => !solve.dnf)
  const hasDnf = valid.length !== solves.length
  const stats: CubeStatistics = {
    count: solves.length,
    best: valid.length > 0 ? Math.min(...valid.map((solve) => solve.time)) : 0,
    deviation: getDeviation(solves),
    mean: getMean(solves),
    ao3: 0,
    ao5: 0,
    ao12: 0,
    ao50: 0,
    ao100: 0,
    worst: hasDnf || valid.length === 0 ? 0 : Math.max(...valid.map((solve) => solve.time))
  }
  for (const ao of [3, 5, 12, 50, 100]) {
    stats[`ao${ao}` as keyof CubeStatistics] = type === 'global' ? legacyBestAo(solves, ao) : calcCurrentAo(solves, ao)
  }
  return stats
}

function legacy(cubes: Cube[], selectedCube: Cube) {
  const { global, session, cubeSession } = getSolvesMetrics({
    cubesDB: cubes,
    category: selectedCube.category,
    cubeName: selectedCube.name
  })
  return {
    global: legacyList(global, 'global'),
    session: legacyList(session, 'session'),
    cubeSession: legacyList(cubeSession, 'cubeSession')
  }
}

let clock = 1_000_000
function solveNow(random: () => number, cubeId: string, integers = true): Solve {
  const time = integers ? Math.round(8_000 + random() * 6_000) : 8_000 + random() * 6_000
  clock += time + 1
  return makeSolve({
    id: `s-${clock}`,
    cubeId,
    time,
    endTime: clock,
    startTime: clock - time,
    dnf: random() < 0.08,
    plus2: random() < 0.05
  })
}

function buildCubes(random: () => number, count: number): Cube[] {
  const cubes = [
    makeCube({ id: 'a', name: 'A', category: '3x3' }),
    makeCube({ id: 'b', name: 'B', category: '3x3' }),
    makeCube({ id: 'c', name: 'C', category: '4x4' })
  ]
  for (let i = 0; i < count; i++) {
    const cube = cubes[Math.floor(random() * cubes.length)]
    const bucket = random() < 0.6 ? cube.solves.all : cube.solves.session
    bucket.unshift(solveNow(random, cube.id))
  }
  return cubes
}

function withSession(cubes: Cube[], cubeId: string, added: Solve[]): Cube[] {
  return cubes.map((cube) =>
    cube.id === cubeId ? { ...cube, solves: { ...cube.solves, session: [...added, ...cube.solves.session] } } : cube
  )
}

describe('timer stats engine', () => {
  it('computes exactly what the previous full calculation did', () => {
    const random = rng(3)
    for (const count of [0, 4, 30, 400]) {
      const cubes = buildCubes(random, count)
      expect(timerStatsResult(createTimerStats(cubes, cubes[0]))).toEqual(legacy(cubes, cubes[0]))
    }
  })

  it('returns the defaults without a selected cube', () => {
    expect(timerStatsResult(createTimerStats([], null)).global).toEqual(defaultTimerStatistics)
  })

  it('gives the same result appending solve by solve as recomputing from scratch', () => {
    const random = rng(5)
    let cubes = buildCubes(random, 300)
    let state = createTimerStats(cubes, cubes[0]) as TimerStatsState
    for (let step = 0; step < 150; step++) {
      const added = Array.from({ length: 1 + Math.floor(random() * 3) }, () =>
        solveNow(random, 'a', step % 10 !== 0)
      ).reverse()
      cubes = withSession(cubes, 'a', added)
      state = appendTimerStats(state, 'a', added)!
      expect(state.incremental).toBe(true)
      expect(state.result).toEqual(legacy(cubes, cubes[0]))
    }
  })

  it('falls back to a full calculation when the new solve is older than the newest one', () => {
    const random = rng(8)
    const cubes = buildCubes(random, 80)
    const state = createTimerStats(cubes, cubes[0])!
    const older = makeSolve({ id: 'old', cubeId: 'a', time: 9_000, endTime: 10, startTime: 1 })
    const next = appendTimerStats(state, 'a', [older])!
    expect(next.result).toEqual(legacy(withSession(cubes, 'a', [older]), cubes[0]))
  })

  it('falls back when another cube of the category shares the selected name', () => {
    const random = rng(9)
    const cubes = buildCubes(random, 60)
    cubes[1] = { ...cubes[1], name: 'A' }
    const state = createTimerStats(cubes, cubes[0])!
    expect(state.incremental).toBe(false)
    const added = [solveNow(random, 'a')]
    expect(appendTimerStats(state, 'a', added)!.result).toEqual(legacy(withSession(cubes, 'a', added), cubes[0]))
  })

  it('refuses an append for a cube other than the selected one', () => {
    const cubes = buildCubes(rng(1), 10)
    expect(appendTimerStats(createTimerStats(cubes, cubes[0])!, 'b', [makeSolve()])).toBeNull()
  })
})

describe('detectSessionAppend', () => {
  const setup = () => {
    const cubes = buildCubes(rng(4), 40)
    return { cubes, selected: cubes[0] }
  }

  const prepend = (cubes: Cube[], added: Solve[]) => {
    const updated = { ...cubes[0], solves: { ...cubes[0].solves, session: [...added, ...cubes[0].solves.session] } }
    return { next: cubes.map((cube) => (cube.id === updated.id ? updated : cube)), updated }
  }

  it('detects new solves at the head of the selected session', () => {
    const { cubes, selected } = setup()
    const added = [makeSolve({ id: 'n1' }), makeSolve({ id: 'n2' })]
    const { next, updated } = prepend(cubes, added)
    expect(detectSessionAppend(cubes, selected, next, updated)).toEqual({ cubeId: 'a', solves: added })
  })

  it('rejects an edit to an existing solve', () => {
    const { cubes, selected } = setup()
    const session = [...selected.solves.session]
    session[0] = { ...session[0], dnf: !session[0].dnf }
    const updated = { ...selected, solves: { ...selected.solves, session: [makeSolve(), ...session] } }
    const next = cubes.map((cube) => (cube.id === updated.id ? updated : cube))
    expect(detectSessionAppend(cubes, selected, next, updated)).toBeNull()
  })

  it('rejects changes to another cube or to the history bucket', () => {
    const { cubes, selected } = setup()
    const other = cubes.map((cube, i) => (i === 1 ? { ...cube } : cube))
    expect(detectSessionAppend(cubes, selected, other, selected)).toBeNull()

    const updated = { ...selected, solves: { ...selected.solves, all: [makeSolve(), ...selected.solves.all] } }
    const next = cubes.map((cube) => (cube.id === updated.id ? updated : cube))
    expect(detectSessionAppend(cubes, selected, next, updated)).toBeNull()
  })

  it('rejects switching the selected cube', () => {
    const { cubes } = setup()
    expect(detectSessionAppend(cubes, cubes[0], cubes, cubes[1])).toBeNull()
  })
})
