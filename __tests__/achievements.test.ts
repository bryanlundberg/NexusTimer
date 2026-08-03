import { describe, expect, it } from 'vitest'
import dayjs from '@/shared/lib/dayjs'
import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'
import { UserProfile } from '@/entities/user/model/user'
import { CUBE_CATEGORIES, CubeCategory } from '@/shared/const/cube-categories'
import { computeSolveStats } from '@/entities/achievement/model/achievements'
import { resolveBadges } from '@/entities/achievement/model/resolve-badges'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'
import { makeUser } from './fixtures/user'

/**
 * CONTRACT TEST — do not relax these expectations.
 *
 * Every assertion here is a user-visible unlock rule: which rung of which
 * family a given solve history earns. Changing one is a product decision, not
 * something a refactor may do quietly.
 *
 * Assertions are on `{ family: level }` rather than on tier ids, so renaming a
 * rung is free while moving a threshold is not.
 */

// Slower than the easiest rung of either speed ladder, so fixtures that care
// about counts never accidentally earn a speed level too.
const DEFAULT_TIME = 150_000

function at(date: string): number {
  return dayjs(date).valueOf()
}

/**
 * A neutral, mid-year day. The shared `makeSolve` fixture defaults `startTime`
 * to 0 — the epoch — which formats as 1970-01-01 in UTC and every positive
 * offset, silently unlocking `new-year-solve`. Every solve built here gets a
 * real date so the suite is timezone-independent.
 */
const NEUTRAL_DAY = at('2025-03-01')

function solve(overrides: Partial<Solve> = {}): Solve {
  return makeSolve({ startTime: NEUTRAL_DAY, time: DEFAULT_TIME, ...overrides })
}

/** Fast bulk builder — avoids per-solve `Math.random()` for large fixtures. */
function bulkSolves(count: number, overrides: Partial<Solve> = {}): Solve[] {
  const out: Solve[] = new Array(count)
  for (let i = 0; i < count; i++) {
    out[i] = {
      id: `s-${i}`,
      cubeId: 'cube-1',
      scramble: '',
      startTime: NEUTRAL_DAY,
      endTime: 0,
      bookmark: false,
      time: DEFAULT_TIME,
      rating: 0,
      dnf: false,
      plus2: false,
      ...overrides
    }
  }
  return out
}

/**
 * Level held in every family that has one, keyed by family id. Families sitting
 * at zero are omitted so each expectation reads as "exactly what was earned".
 */
function levels(cubes: Cube[], user: UserProfile = makeUser()): Record<string, number> {
  const out: Record<string, number> = {}
  for (const family of resolveBadges({ user, cubes }).families) {
    if (family.type !== 'granted' && family.level > 0) out[family.id] = family.level
  }
  return out
}

/** One cube holding `solves` in `all`. */
function cubeWith(solves: Solve[], category: CubeCategory = '3x3'): Cube {
  return makeCube({ category, allSolves: solves })
}

describe('achievements — unlock rules', () => {
  it('unlocks nothing for a brand new account with no cubes', () => {
    expect(levels([])).toEqual({})
  })

  describe('first-year', () => {
    it('unlocks for accounts created inside the launch window', () => {
      expect(levels([], makeUser({ createdAt: new Date('2024-08-01') }))).toEqual({ 'first-year': 1 })
    })

    it('unlocks on the day before the cutoff and not on the cutoff itself', () => {
      // Built through dayjs on purpose: the condition compares against a *local*
      // midnight, so `new Date('2025-07-11')` (parsed as UTC) would land on the
      // wrong side of the boundary in any negative-offset timezone.
      expect(levels([], makeUser({ createdAt: dayjs('2025-07-10').toDate() }))).toEqual({ 'first-year': 1 })
      expect(levels([], makeUser({ createdAt: dayjs('2025-07-11').toDate() }))).toEqual({})
    })
  })

  describe('3x3 single-solve speed', () => {
    // One 3x3 cube with one solve also earns the opening rungs of the cube and
    // category ladders; those are asserted alongside so the sets stay exact.
    const withSolve = (time: number, overrides: Partial<Solve> = {}) => [cubeWith([solve({ time, ...overrides })])]

    it('climbs the ladder as times drop past each threshold', () => {
      expect(levels(withSolve(9_999))).toEqual({ 'speed-3x3': 8, 'cube-collection': 1 })
    })

    it('treats every rung as exclusive', () => {
      expect(levels(withSolve(10_000))['speed-3x3']).toBe(7)
      expect(levels(withSolve(9_999))['speed-3x3']).toBe(8)
      expect(levels(withSolve(8_000))['speed-3x3']).toBe(8)
      expect(levels(withSolve(7_999))['speed-3x3']).toBe(9)
      expect(levels(withSolve(6_000))['speed-3x3']).toBe(9)
      expect(levels(withSolve(5_999))['speed-3x3']).toBe(10)
    })

    it('ignores DNF solves however fast they are', () => {
      expect(levels(withSolve(1_000, { dnf: true }))['speed-3x3']).toBeUndefined()
    })

    it('ignores fast solves logged on a non-3x3 cube', () => {
      expect(levels([cubeWith([solve({ time: 1_000 })], '4x4')])['speed-3x3']).toBeUndefined()
    })
  })

  describe('one-handed speed', () => {
    const oh = (time: number) => [cubeWith([solve({ time })], '3x3 OH')]

    it('keeps the sub-30 rung exclusive', () => {
      expect(levels(oh(30_000))['oh-speed']).toBe(4)
      expect(levels(oh(29_999))['oh-speed']).toBe(5)
    })

    it('does not feed the two-handed ladder', () => {
      expect(levels(oh(5_000))['speed-3x3']).toBeUndefined()
    })
  })

  describe('blindfolded', () => {
    it('counts successes, however slow', () => {
      expect(levels([cubeWith([solve({ time: 600_000 })], '3x3 BLD')])['bld']).toBe(1)
      expect(levels([cubeWith(bulkSolves(10), '3x3 BLD')])['bld']).toBe(2)
    })

    it('stays locked when every attempt is a DNF', () => {
      expect(levels([cubeWith([solve({ dnf: true })], '3x3 BLD')])['bld']).toBeUndefined()
    })
  })

  describe('cube collection', () => {
    const emptyCubes = (n: number) => Array.from({ length: n }, () => makeCube())

    it('climbs a rung at each exact threshold', () => {
      expect(levels(emptyCubes(1))).toEqual({ 'cube-collection': 1 })
      expect(levels(emptyCubes(4))).toEqual({ 'cube-collection': 2 })
      expect(levels(emptyCubes(5))).toEqual({ 'cube-collection': 3 })
      expect(levels(emptyCubes(25))).toEqual({ 'cube-collection': 5 })
      expect(levels(emptyCubes(50))).toEqual({ 'cube-collection': 6 })
      expect(levels(emptyCubes(100))).toEqual({ 'cube-collection': 7 })
    })

    it('counts soft-deleted cubes toward the total', () => {
      expect(levels([...emptyCubes(4), makeCube({ isDeleted: true })])).toEqual({ 'cube-collection': 3 })
    })
  })

  describe('categories', () => {
    const oneSolvePerCategory = (categories: readonly CubeCategory[]) =>
      categories.map((category) => cubeWith([solve()], category))

    it('tops out once every category has a valid solve', () => {
      expect(levels(oneSolvePerCategory(CUBE_CATEGORIES))['categories']).toBe(5)
    })

    it('holds one rung short when a single category is missing', () => {
      expect(levels(oneSolvePerCategory(CUBE_CATEGORIES.slice(0, -1)))['categories']).toBe(4)
    })

    it('does not count a category whose only solve is a DNF', () => {
      const cubes = oneSolvePerCategory(CUBE_CATEGORIES.slice(0, -1))
      cubes.push(cubeWith([solve({ dnf: true })], CUBE_CATEGORIES[CUBE_CATEGORIES.length - 1]))
      expect(levels(cubes)['categories']).toBe(4)
    })
  })

  describe('marathon', () => {
    it('requires strictly more than each threshold', () => {
      expect(levels([cubeWith(bulkSolves(500))])['marathon']).toBe(4)
      expect(levels([cubeWith(bulkSolves(501))])['marathon']).toBe(5)
    })
  })

  describe('daily streaks', () => {
    const consecutiveDays = (days: number) =>
      Array.from({ length: days }, (_, i) => solve({ startTime: dayjs('2025-01-05').add(i, 'day').valueOf() }))

    it('climbs with the length of the longest run', () => {
      expect(levels([cubeWith(consecutiveDays(29))])['daily-streak']).toBe(3)
      expect(levels([cubeWith(consecutiveDays(30))])['daily-streak']).toBe(4)
      expect(levels([cubeWith(consecutiveDays(365))])['daily-streak']).toBe(8)
    })

    it('breaks the run on a skipped day', () => {
      const solves = consecutiveDays(40)
      solves.splice(20, 1)
      expect(levels([cubeWith(solves)])['daily-streak']).toBe(3)
    })

    it('picks up a January 1st inside a long run', () => {
      expect(levels([cubeWith(consecutiveDays(365))])['new-year-solve']).toBe(1)
    })
  })

  describe('clean streaks', () => {
    // Chunked at 400/day so the marathon ladder stays out of the picture.
    const cleanRun = (count: number) => {
      const solves: Solve[] = []
      for (let i = 0; i < count; i += 400) {
        const day = dayjs('2025-03-01')
          .add(i / 400, 'day')
          .valueOf()
        solves.push(...bulkSolves(Math.min(400, count - i), { startTime: day }))
      }
      return solves
    }

    it('climbs with the longest penalty-free run', () => {
      expect(levels([cubeWith(cleanRun(999))])['clean-streak']).toBe(6)
      expect(levels([cubeWith(cleanRun(1000))])['clean-streak']).toBe(7)
    })

    it('resets the run on a +2', () => {
      const solves = cleanRun(1200)
      solves[600] = { ...solves[600], plus2: true }
      expect(levels([cubeWith(solves)])['clean-streak']).toBe(6)
    })
  })

  describe('new year solve', () => {
    it('unlocks for a valid solve on January 1st and not on the 2nd', () => {
      expect(levels([cubeWith([solve({ startTime: at('2025-01-01') })])])['new-year-solve']).toBe(1)
      expect(levels([cubeWith([solve({ startTime: at('2025-01-02') })])])['new-year-solve']).toBeUndefined()
    })
  })

  describe('bookmarks', () => {
    it('climbs at each exact threshold', () => {
      expect(levels([cubeWith(bulkSolves(24, { bookmark: true }))])['bookmarks']).toBe(2)
      expect(levels([cubeWith(bulkSolves(25, { bookmark: true }))])['bookmarks']).toBe(3)
    })

    it('counts bookmarks on DNF solves', () => {
      expect(levels([cubeWith(bulkSolves(25, { bookmark: true, dnf: true }))])['bookmarks']).toBe(3)
    })

    it('ignores bookmarks on soft-deleted solves', () => {
      expect(levels([cubeWith(bulkSolves(25, { bookmark: true, isDeleted: true }))])['bookmarks']).toBeUndefined()
    })
  })

  describe('comments', () => {
    it('climbs at each exact threshold', () => {
      expect(levels([cubeWith(bulkSolves(9, { comment: 'nice' }))])['comments']).toBe(1)
      expect(levels([cubeWith(bulkSolves(10, { comment: 'nice' }))])['comments']).toBe(2)
    })

    it('ignores whitespace-only comments', () => {
      expect(levels([cubeWith(bulkSolves(10, { comment: '   ' }))])['comments']).toBeUndefined()
    })
  })

  describe('smart cube', () => {
    it('unlocks on the first solve carrying a replay', () => {
      const replay = { version: 1 as const, puzzle: '3x3', scramble: '', durationMs: 1_000, moves: [] }
      expect(levels([cubeWith([solve({ replay })])])['smart-cube']).toBe(1)
    })
  })

  describe('high-volume ladders', () => {
    it('climbs career, per-cube, marathon and clean ladders together at 100k solves', () => {
      expect(levels([cubeWith(bulkSolves(100_000))])).toEqual({
        'career-solves': 9,
        'solves-per-cube': 7,
        marathon: 6,
        'clean-streak': 7,
        'cube-collection': 1
      })
    })

    it('measures the per-cube ladder per cube, never as a career total', () => {
      const cubes = [cubeWith(bulkSolves(6_000)), cubeWith(bulkSolves(6_000))]
      expect(levels(cubes)['solves-per-cube']).toBe(5)
      expect(levels(cubes)['career-solves']).toBe(6)
    })
  })

  describe('granted badges', () => {
    it('unlocks only the keys present on the profile', () => {
      const user = makeUser({ grantedAchievements: ['bug-hunter', 'contributor'] })
      const granted = resolveBadges({ user, cubes: [] })
        .unlockedFamilies.filter((f) => f.type === 'granted')
        .map((f) => f.id)
        .sort()
      expect(granted).toEqual(['bug-hunter', 'contributor'])
    })

    it('never unlocks a granted badge from solve data alone', () => {
      const result = resolveBadges({ user: makeUser(), cubes: [cubeWith(bulkSolves(100_000))] })
      expect(result.unlockedFamilies.filter((f) => f.type === 'granted')).toEqual([])
    })
  })

  it('partitions families and counts rungs consistently', () => {
    const result = resolveBadges({ user: makeUser(), cubes: [] })
    expect(result.unlockedFamilies.length + result.lockedFamilies.length).toBe(result.families.length)
    expect(result.earnedTiers).toBe(0)
    expect(result.totalTiers).toBe(result.families.reduce((n, f) => n + f.maxLevel, 0))
  })
})

describe('computeSolveStats — aggregates behind the ladders', () => {
  it('counts only valid solves toward the career total', () => {
    const solves = [solve(), solve({ dnf: true }), solve({ isDeleted: true }), solve({ plus2: true })]
    expect(computeSolveStats([cubeWith(solves)]).totalValid).toBe(2)
  })

  it('tracks the busiest single day rather than a per-cube total', () => {
    const cubes = [
      cubeWith(bulkSolves(30, { startTime: at('2025-03-01') })),
      cubeWith(bulkSolves(12, { startTime: at('2025-03-01') })),
      cubeWith(bulkSolves(20, { startTime: at('2025-03-02') }))
    ]
    expect(computeSolveStats(cubes).maxSolvesInOneDay).toBe(42)
  })

  it('reports the longest date streak, not the current one', () => {
    const early = [0, 1, 2, 3, 4].map((i) => solve({ startTime: dayjs('2025-01-01').add(i, 'day').valueOf() }))
    const late = [solve({ startTime: at('2025-06-01') })]
    expect(computeSolveStats([cubeWith([...early, ...late])]).longestDateStreak).toBe(5)
  })

  it('carries the clean streak across cubes in [...all, ...session] order', () => {
    const stats = computeSolveStats([
      makeCube({ allSolves: bulkSolves(10), sessionSolves: bulkSolves(5) }),
      makeCube({ allSolves: bulkSolves(7) })
    ])
    expect(stats.longestCleanStreak).toBe(22)
  })

  it('records the largest 3x3 solve count held by any single cube', () => {
    const cubes = [cubeWith(bulkSolves(40)), cubeWith(bulkSolves(90)), cubeWith(bulkSolves(90), '4x4')]
    expect(computeSolveStats(cubes).max3x3SolvesPerCube).toBe(90)
  })

  it('collects the set of categories holding at least one valid solve', () => {
    const cubes = [cubeWith([solve()], '3x3'), cubeWith([solve({ dnf: true })], '4x4'), cubeWith([solve()], 'Megaminx')]
    expect(Array.from(computeSolveStats(cubes).categoriesWithValidSolves).sort()).toEqual(['3x3', 'Megaminx'])
  })
})
