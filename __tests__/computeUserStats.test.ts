import { minBy, orderBy } from 'es-toolkit'
import { computeUserStats } from '@/entities/user-stats/lib/compute-user-stats'
import { deserializeSolveStats } from '@/entities/user-stats/lib/solve-stats-serialization'
import { RECENT_SOLVES_LIMIT } from '@/entities/user-stats/model/types'
import { resolveBadges, resolveBadgesFromStats } from '@/entities/achievement/model/resolve-badges'
import calcBestAo, { findBestAoWindow } from '@/shared/lib/statistics/calcBestAo'
import { mergeSolvesNewestFirst } from '@/entities/solve/lib/sortSolves'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'
import { makeUser } from './fixtures/user'
import type { Solve } from '@/entities/solve/model/types'

let clock = 1_700_000_000_000
const solve = (time: number, overrides: Partial<Solve> = {}) => {
  clock += 60_000
  return makeSolve({ time, startTime: clock - time, endTime: clock, scramble: `S${clock}`, ...overrides })
}

function buildCubes() {
  clock = 1_700_000_000_000
  const main = makeCube({
    id: 'c1',
    name: 'Main',
    category: '3x3',
    createdAt: 10,
    allSolves: [solve(9000), solve(8000), solve(12000, { dnf: true }), solve(7000), solve(9500)],
    sessionSolves: [solve(6000, { plus2: true }), solve(8500), solve(1000, { isDeleted: true })]
  })
  const backup = makeCube({
    id: 'c2',
    name: 'Backup',
    category: '3x3',
    createdAt: 20,
    allSolves: [solve(7500), solve(9900)]
  })
  const big = makeCube({
    id: 'c3',
    name: 'Big',
    category: '4x4',
    createdAt: 30,
    sessionSolves: Array.from({ length: 30 }, (_, i) => solve(40000 + i * 100))
  })
  return [main, backup, big]
}

describe('computeUserStats', () => {
  const cubes = buildCubes()
  const stats = computeUserStats(cubes, 'UTC')

  const tagged = [
    ...cubes.flatMap((cube) =>
      cube.solves.session.map((s) => ({ ...s, category: cube.category, cubeName: cube.name }))
    ),
    ...cubes.flatMap((cube) => cube.solves.all.map((s) => ({ ...s, category: cube.category, cubeName: cube.name })))
  ].filter((s) => !s.isDeleted)

  it('counts every non deleted solve, DNFs included', () => {
    expect(stats.totalSolves).toBe(tagged.length)
    expect(stats.totalSolves).toBe(9 + 30)
  })

  it('orders categories by the app category order', () => {
    expect(stats.categories.map((c) => c.category)).toEqual(['3x3', '4x4'])
  })

  it('matches the overview row for each category', () => {
    for (const category of stats.categories) {
      const solves = tagged.filter((s) => s.category === category.category)
      const ordered = orderBy(solves, [(s) => s.endTime], ['asc'])
      const best = minBy(
        solves.filter((s) => !s.dnf),
        (s) => s.time
      )!
      const window = findBestAoWindow(ordered, 5)!

      expect(category.count).toBe(solves.length)
      expect(category.best).toEqual({ time: best.time, cubeName: best.cubeName, endTime: best.endTime })
      expect(category.bestAo5?.time).toBe(calcBestAo(ordered, 5))
      expect(category.bestAo5?.window.map((s) => s.id)).toEqual(window.map((s) => s.id))
      expect(category.bestAo5?.cubeName).toBe(window[4].cubeName)
      expect(category.bestAo5?.endTime).toBe(window[4].endTime)
    }
  })

  it('matches the cube card for each cube', () => {
    const main = stats.cubes.find((c) => c.id === 'c1')!
    const solves = mergeSolvesNewestFirst([cubes[0].solves.all, cubes[0].solves.session]).filter((s) => !s.isDeleted)

    expect(main).toMatchObject({ name: 'Main', category: '3x3', createdAt: 10 })
    expect(main.counts).toEqual({ ok: 5, plus2: 1, dnf: 1 })
    expect(main.best).toBe(6000)
    expect(main.bestAo5).toBe(calcBestAo(solves, 5))
    expect(main.totalTime).toBe(solves.reduce((sum, s) => sum + s.time, 0))
  })

  it('reports null records for a cube too small for an Ao5', () => {
    const backup = stats.cubes.find((c) => c.id === 'c2')!
    expect(backup.bestAo5).toBeNull()
    expect(backup.best).toBe(7500)
  })

  it('keeps the newest solves by start time for the timeline', () => {
    const expected = orderBy(tagged, ['startTime'], ['desc']).slice(0, RECENT_SOLVES_LIMIT)

    expect(stats.recentSolves).toHaveLength(RECENT_SOLVES_LIMIT)
    expect(stats.recentSolves.map((s) => s.id)).toEqual(expected.map((s) => s.id))
    expect(stats.recentSolves[0]).toEqual({
      id: expected[0].id,
      time: expected[0].time,
      startTime: expected[0].startTime,
      scramble: expected[0].scramble,
      dnf: false,
      plus2: false,
      category: expected[0].category,
      cubeName: expected[0].cubeName
    })
  })

  it('stores the timezone it was computed with', () => {
    expect(computeUserStats(cubes, 'America/Mexico_City').timezone).toBe('America/Mexico_City')
  })

  it('yields the same badges as resolving from the full backup', () => {
    const user = makeUser()
    const fromStats = resolveBadgesFromStats({
      user,
      stats: deserializeSolveStats(stats.achievements.solveStats),
      cubeCount: stats.achievements.cubeCount
    })

    expect(fromStats).toEqual(resolveBadges({ user, cubes, timezone: 'UTC' }))
  })

  it('survives a JSON round trip, as it does through Mongo', () => {
    expect(JSON.parse(JSON.stringify(stats))).toEqual(stats)
  })

  it('handles an empty backup', () => {
    expect(computeUserStats([], 'UTC')).toMatchObject({
      totalSolves: 0,
      categories: [],
      cubes: [],
      recentSolves: [],
      achievements: { cubeCount: 0 }
    })
  })
})
