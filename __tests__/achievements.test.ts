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

const DEFAULT_TIME = 15_000 // slow enough to trip no speed badge

function at(date: string): number {
  return dayjs(date).valueOf()
}

const NEUTRAL_DAY = at('2025-03-01')

function solve(overrides: Partial<Solve> = {}): Solve {
  return makeSolve({ startTime: NEUTRAL_DAY, time: DEFAULT_TIME, ...overrides })
}

/** Fast bulk builder - for large fixtures. */
function bulkSolves(count: number, overrides: Partial<Solve> = {}): Solve[] {
  const out: Solve[] = new Array(count)
  for (let i = 0; i < count; i++) {
    out[i] = {
      id: `s-${i}`,
      cubeId: 'cube-1',
      scramble: '',
      startTime: at('2025-03-01'),
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

/** Ids of every non-granted badge the user has unlocked, sorted. */
function unlockedIds(cubes: Cube[], user: UserProfile = makeUser()): string[] {
  return resolveBadges({ user, cubes })
    .unlocked.filter((b) => b.type !== 'granted')
    .map((b) => b.id)
    .sort()
}

/** One cube holding `solves` in `all`. */
function cubeWith(solves: Solve[], category: CubeCategory = '3x3'): Cube {
  return makeCube({ category, allSolves: solves })
}

describe('achievements — baseline unlock rules', () => {
  it('unlocks nothing for a brand new account with no cubes', () => {
    expect(unlockedIds([])).toEqual([])
  })

  describe('first-year', () => {
    it('unlocks for accounts created inside the launch window', () => {
      const user = makeUser({ createdAt: new Date('2024-08-01') })
      expect(unlockedIds([], user)).toEqual(['first-year'])
    })

    it('unlocks on the day before the cutoff and not on the cutoff itself', () => {
      // Built through dayjs on purpose: the condition compares against a *local*
      // midnight, so `new Date('2025-07-11')` (parsed as UTC) would land on the
      // wrong side of the boundary in any negative-offset timezone.
      expect(unlockedIds([], makeUser({ createdAt: dayjs('2025-07-10').toDate() }))).toEqual(['first-year'])
      expect(unlockedIds([], makeUser({ createdAt: dayjs('2025-07-11').toDate() }))).toEqual([])
    })
  })

  describe('3x3 single-solve speed', () => {
    it('unlocks speed-demon under 10s but not at exactly 10s', () => {
      expect(unlockedIds([cubeWith([solve({ time: 9_999 })])])).toEqual(['speed-demon'])
      expect(unlockedIds([cubeWith([solve({ time: 10_000 })])])).toEqual([])
    })

    it('unlocks both tiers under 8s, and only speed-demon at exactly 8s', () => {
      expect(unlockedIds([cubeWith([solve({ time: 7_999 })])])).toEqual(['speed-demon', 'sub-8-3x3'])
      expect(unlockedIds([cubeWith([solve({ time: 8_000 })])])).toEqual(['speed-demon'])
    })

    it('ignores DNF solves however fast they are', () => {
      expect(unlockedIds([cubeWith([solve({ time: 1_000, dnf: true })])])).toEqual([])
    })

    it('ignores fast solves logged on a non-3x3 cube', () => {
      expect(unlockedIds([cubeWith([solve({ time: 1_000 })], '4x4')])).toEqual([])
    })
  })

  describe('oh-sub-30', () => {
    it('unlocks under 30s on 3x3 OH but not at exactly 30s', () => {
      expect(unlockedIds([cubeWith([solve({ time: 29_999 })], '3x3 OH')])).toEqual(['oh-sub-30'])
      expect(unlockedIds([cubeWith([solve({ time: 30_000 })], '3x3 OH')])).toEqual([])
    })
  })

  describe('bld-success', () => {
    it('unlocks on any successful BLD solve regardless of time', () => {
      expect(unlockedIds([cubeWith([solve({ time: 600_000 })], '3x3 BLD')])).toEqual(['bld-success'])
    })

    it('stays locked when every BLD attempt is a DNF', () => {
      expect(unlockedIds([cubeWith([solve({ dnf: true })], '3x3 BLD')])).toEqual([])
    })
  })

  describe('collector tiers', () => {
    const emptyCubes = (n: number) => Array.from({ length: n }, () => makeCube())

    it('unlocks each tier at its exact threshold', () => {
      expect(unlockedIds(emptyCubes(4))).toEqual([])
      expect(unlockedIds(emptyCubes(5))).toEqual(['collector-5'])
      expect(unlockedIds(emptyCubes(25))).toEqual(['collector', 'collector-5'])
      expect(unlockedIds(emptyCubes(50))).toEqual(['collector', 'collector-5', 'collector-50'])
    })

    it('counts soft-deleted cubes toward the total', () => {
      const cubes = [...emptyCubes(4), makeCube({ isDeleted: true })]
      expect(unlockedIds(cubes)).toEqual(['collector-5'])
    })
  })

  describe('eventglot', () => {
    const oneSolvePerCategory = (categories: readonly CubeCategory[]) =>
      categories.map((category) => cubeWith([solve({ time: category === '3x3 OH' ? 45_000 : DEFAULT_TIME })], category))

    it('unlocks once every category has a valid solve', () => {
      expect(unlockedIds(oneSolvePerCategory(CUBE_CATEGORIES))).toEqual(['bld-success', 'collector-5', 'eventglot'])
    })

    it('stays locked when a single category is missing', () => {
      const allButOne = CUBE_CATEGORIES.slice(0, -1)
      expect(unlockedIds(oneSolvePerCategory(allButOne))).toEqual(['bld-success', 'collector-5'])
    })

    it('does not count a category whose only solve is a DNF', () => {
      const cubes = oneSolvePerCategory(CUBE_CATEGORIES.slice(0, -1))
      const last = CUBE_CATEGORIES[CUBE_CATEGORIES.length - 1]
      cubes.push(cubeWith([solve({ dnf: true })], last))
      expect(unlockedIds(cubes)).toEqual(['bld-success', 'collector-5'])
    })
  })

  describe('marathonist', () => {
    it('requires strictly more than 500 solves in one day', () => {
      expect(unlockedIds([cubeWith(bulkSolves(500))])).toEqual([])
      expect(unlockedIds([cubeWith(bulkSolves(501))])).toEqual(['marathonist'])
    })
  })

  describe('daily streaks', () => {
    const consecutiveDays = (days: number) =>
      Array.from({ length: days }, (_, i) =>
        solve({ time: DEFAULT_TIME, startTime: dayjs('2025-01-05').add(i, 'day').valueOf() })
      )

    it('stays locked at 29 consecutive days', () => {
      expect(unlockedIds([cubeWith(consecutiveDays(29))])).toEqual([])
    })

    it('unlocks streak-30 at 30 consecutive days', () => {
      expect(unlockedIds([cubeWith(consecutiveDays(30))])).toEqual(['streak-30'])
    })

    it('unlocks both streak badges at 365 consecutive days', () => {
      // Any 365-day window necessarily contains a January 1st, so `new-year-solve`
      // rides along — that coupling is intentional, not an accident of the fixture.
      expect(unlockedIds([cubeWith(consecutiveDays(365))])).toEqual([
        'consistency-is-key',
        'new-year-solve',
        'streak-30'
      ])
    })

    it('breaks the streak on a skipped day', () => {
      const solves = consecutiveDays(40)
      solves.splice(20, 1)
      expect(unlockedIds([cubeWith(solves)])).toEqual([])
    })
  })

  describe('zen-master', () => {
    // Chunked at 400/day so `marathonist` (>500/day) stays out of the picture,
    // and kept short enough that no streak badge fires either.
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

    it('stays locked at 999 penalty-free solves', () => {
      expect(unlockedIds([cubeWith(cleanRun(999))])).toEqual([])
    })

    it('unlocks at 1000 penalty-free solves', () => {
      expect(unlockedIds([cubeWith(cleanRun(1000))])).toEqual(['zen-master'])
    })

    it('resets the run on a +2', () => {
      const solves = cleanRun(1200)
      solves[600] = { ...solves[600], plus2: true }
      expect(unlockedIds([cubeWith(solves)])).toEqual([])
    })
  })

  describe('new-year-solve', () => {
    it('unlocks for a valid solve on January 1st', () => {
      expect(unlockedIds([cubeWith([solve({ time: DEFAULT_TIME, startTime: at('2025-01-01') })])])).toEqual([
        'new-year-solve'
      ])
    })

    it('stays locked on January 2nd', () => {
      expect(unlockedIds([cubeWith([solve({ time: DEFAULT_TIME, startTime: at('2025-01-02') })])])).toEqual([])
    })
  })

  describe('bookmarker', () => {
    it('unlocks at 25 bookmarks and not at 24', () => {
      expect(unlockedIds([cubeWith(bulkSolves(24, { bookmark: true }))])).toEqual([])
      expect(unlockedIds([cubeWith(bulkSolves(25, { bookmark: true }))])).toEqual(['bookmarker'])
    })

    it('counts bookmarks on DNF solves', () => {
      expect(unlockedIds([cubeWith(bulkSolves(25, { bookmark: true, dnf: true }))])).toEqual(['bookmarker'])
    })

    it('ignores bookmarks on soft-deleted solves', () => {
      expect(unlockedIds([cubeWith(bulkSolves(25, { bookmark: true, isDeleted: true }))])).toEqual([])
    })
  })

  describe('commentator', () => {
    it('unlocks at 10 comments and not at 9', () => {
      expect(unlockedIds([cubeWith(bulkSolves(9, { comment: 'nice' }))])).toEqual([])
      expect(unlockedIds([cubeWith(bulkSolves(10, { comment: 'nice' }))])).toEqual(['commentator'])
    })

    it('ignores whitespace-only comments', () => {
      expect(unlockedIds([cubeWith(bulkSolves(10, { comment: '   ' }))])).toEqual([])
    })
  })

  describe('smart-mover', () => {
    it('unlocks on the first solve carrying a replay', () => {
      const replay = { version: 1 as const, puzzle: '3x3', scramble: '', durationMs: 1_000, moves: [] }
      expect(unlockedIds([cubeWith([solve({ time: DEFAULT_TIME, replay })])])).toEqual(['smart-mover'])
    })
  })

  describe('high-volume badges', () => {
    it('unlocks the full high-volume set at 100k solves on one 3x3 cube', () => {
      expect(unlockedIds([cubeWith(bulkSolves(100_000))])).toEqual([
        'career-100k',
        'marathonist',
        'over-9999-3x3',
        'zen-master'
      ])
    })

    it('measures over-9999-3x3 per cube, never as a career total', () => {
      const cubes = [cubeWith(bulkSolves(6_000)), cubeWith(bulkSolves(6_000))]
      expect(unlockedIds(cubes)).not.toContain('over-9999-3x3')
    })
  })

  describe('granted badges', () => {
    it('unlocks only the keys present on the profile', () => {
      const user = makeUser({ grantedAchievements: ['bug-hunter', 'contributor'] })
      const granted = resolveBadges({ user, cubes: [] })
        .unlocked.filter((b) => b.type === 'granted')
        .map((b) => b.id)
        .sort()
      expect(granted).toEqual(['bug-hunter', 'contributor'])
    })

    it('never unlocks a granted badge from solve data alone', () => {
      const result = resolveBadges({ user: makeUser(), cubes: [cubeWith(bulkSolves(100_000))] })
      expect(result.unlocked.filter((b) => b.type === 'granted')).toEqual([])
    })
  })

  it('exposes a stable badge total with unlocked and locked partitioning the set', () => {
    const result = resolveBadges({ user: makeUser(), cubes: [] })
    expect(result.total).toBe(result.badges.length)
    expect(result.unlocked.length + result.locked.length).toBe(result.total)
  })
})

describe('computeSolveStats — numeric aggregates that survive the refactor', () => {
  it('counts only valid solves toward the career total', () => {
    const solves = [
      solve({ time: DEFAULT_TIME }),
      solve({ time: DEFAULT_TIME, dnf: true }),
      solve({ time: DEFAULT_TIME, isDeleted: true }),
      solve({ time: DEFAULT_TIME, plus2: true })
    ]
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
    const early = [0, 1, 2, 3, 4].map((i) =>
      solve({ time: DEFAULT_TIME, startTime: dayjs('2025-01-01').add(i, 'day').valueOf() })
    )
    const late = [solve({ time: DEFAULT_TIME, startTime: at('2025-06-01') })]
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
    const cubes = [
      cubeWith([solve({ time: DEFAULT_TIME })], '3x3'),
      cubeWith([solve({ dnf: true })], '4x4'),
      cubeWith([solve({ time: DEFAULT_TIME })], 'Megaminx')
    ]
    expect(Array.from(computeSolveStats(cubes).categoriesWithValidSolves).sort()).toEqual(['3x3', 'Megaminx'])
  })
})
