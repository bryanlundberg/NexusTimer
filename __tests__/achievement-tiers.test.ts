import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { Cube } from '@/entities/cube/model/types'
import { ACHIEVEMENTS_CONFIG } from '@/entities/achievement/model/achievements'
import { CATEGORY_ACHIEVEMENTS } from '@/entities/achievement/model/category-achievements'
import { resolveBadges, BadgeFamily, UserBadge } from '@/entities/achievement/model/resolve-badges'
import { isTiered } from '@/entities/achievement/model/types'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'
import { makeUser } from './fixtures/user'

const FAMILY_ORDER = [
  'public-sponsor',
  'contributor',
  'bug-hunter',
  'playstore-beta',
  'first-year',
  'speed-3x3',
  'oh-speed',
  'bld',
  'solves-per-cube',
  'career-solves',
  'cube-collection',
  'categories',
  'marathon',
  'daily-streak',
  'clean-streak',
  'new-year-solve',
  'bookmarks',
  'comments',
  'smart-cube',
  'big-cubes',
  'virtual-solver',
  'oddball-puzzles',
  'time-spent',
  ...CATEGORY_ACHIEVEMENTS.map((a) => a.id)
]

/**
 * Tier ids are `{prefix}-{threshold in display units}` — seconds for the time
 * ladders, raw counts everywhere else. `speed-sub-10` reads as "sub 10s".
 */
const TIER_PREFIX: Record<string, string> = {
  'speed-3x3': 'speed-sub',
  'oh-speed': 'oh-sub',
  bld: 'bld',
  'solves-per-cube': 'cube',
  'career-solves': 'career',
  'cube-collection': 'collector',
  categories: 'categories',
  marathon: 'marathon',
  'daily-streak': 'streak',
  'clean-streak': 'clean',
  bookmarks: 'bookmarks',
  comments: 'comments',
  'smart-cube': 'smart',
  'time-spent': 'time',
  ...Object.fromEntries(CATEGORY_ACHIEVEMENTS.map((a) => [a.id, a.id]))
}

/** Lowest rung of each ladder — nothing may demand more than a first session. */
const OPENING_THRESHOLD: Record<string, number> = {
  'speed-3x3': 120000,
  'oh-speed': 120000,
  bld: 1,
  'solves-per-cube': 100,
  'career-solves': 10,
  'cube-collection': 1,
  categories: 2,
  marathon: 25,
  'daily-streak': 3,
  'clean-streak': 10,
  bookmarks: 1,
  comments: 1,
  'smart-cube': 1,
  'time-spent': 3_600_000
}

/** Generated ladders are checked by shape rather than by a hand-copied value. */
const GENERATED = new Set(CATEGORY_ACHIEVEMENTS.map((a) => a.id))

const TOTAL_TIERS = 229
const TOTAL_FAMILIES = 55
const MAX_LADDER_DEPTH = 10

function familyFor(id: string, cubes: Cube[]): BadgeFamily {
  const family = resolveBadges({ user: makeUser(), cubes }).families.find((f) => f.id === id)
  if (!family) throw new Error(`no family ${id}`)
  return family
}

function allTiers(cubes: Cube[] = []): UserBadge[] {
  return resolveBadges({ user: makeUser(), cubes }).families.flatMap((f) => f.tiers)
}

function tierUnlocked(id: string, cubes: Cube[]): boolean {
  const tier = allTiers(cubes).find((t) => t.id === id)
  if (!tier) throw new Error(`no tier ${id}`)
  return tier.unlocked
}

const emptyCubes = (n: number) => Array.from({ length: n }, () => makeCube())
const cubeAt = (ms: number) => [makeCube({ allSolves: [makeSolve({ time: ms, startTime: Date.now() })] })]

describe('tier ladders', () => {
  describe('ascending metric (cube-collection)', () => {
    it('points at a reachable first rung when empty', () => {
      const family = familyFor('cube-collection', [])
      expect(family.unlocked).toBe(false)
      expect(family.level).toBe(0)
      expect(family.value).toBe(0)
      expect(family.next).toBe(1)
      expect(family.title).toBe('First Cube')
    })

    it('rewards the very first cube', () => {
      expect(familyFor('cube-collection', emptyCubes(1))).toMatchObject({ level: 1, next: 3, unlocked: true })
    })

    it('climbs a rung at each threshold and advertises the one after it', () => {
      expect(familyFor('cube-collection', emptyCubes(5))).toMatchObject({ level: 3, next: 10, title: 'Starter Pack' })
      expect(familyFor('cube-collection', emptyCubes(30))).toMatchObject({
        level: 5,
        next: 50,
        title: 'Puzzle Collector'
      })
    })

    it('drops `next` once the ladder is topped out', () => {
      const family = familyFor('cube-collection', emptyCubes(120))
      expect(family).toMatchObject({ level: 7, maxLevel: 7, title: 'Museum Curator' })
      expect(family.next).toBeUndefined()
    })

    it('keeps one piece of artwork for the whole family, at every rung', () => {
      for (const n of [1, 10, 25, 60]) {
        expect(familyFor('cube-collection', emptyCubes(n)).icon).toBe('badge-shelf.svg')
      }
    })
  })

  describe('descending metric (speed-3x3)', () => {
    it('reports an unreachable value when there are no solves', () => {
      const family = familyFor('speed-3x3', [])
      expect(family.value).toBe(Infinity)
      expect(family.level).toBe(0)
      expect(family.next).toBe(120000)
    })

    it('gives a two-minute solve its first rung', () => {
      expect(familyFor('speed-3x3', cubeAt(90_000))).toMatchObject({ level: 1, next: 60000, unlocked: true })
    })

    it('climbs as times shrink', () => {
      expect(familyFor('speed-3x3', cubeAt(9_500))).toMatchObject({ level: 8, next: 8000 })
      expect(familyFor('speed-3x3', cubeAt(5_500))).toMatchObject({ level: 10, maxLevel: 10 })
      expect(familyFor('speed-3x3', cubeAt(5_500)).next).toBeUndefined()
    })

    it('keeps every rung exclusive', () => {
      expect(tierUnlocked('speed-sub-10', cubeAt(10_000))).toBe(false)
      expect(tierUnlocked('speed-sub-10', cubeAt(9_999))).toBe(true)
      expect(tierUnlocked('speed-sub-8', cubeAt(8_000))).toBe(false)
      expect(tierUnlocked('speed-sub-8', cubeAt(7_999))).toBe(true)
    })
  })

  describe('non-tiered families', () => {
    it('collapses a standalone badge into a single-tier family', () => {
      const family = familyFor('new-year-solve', [])
      expect(family).toMatchObject({ maxLevel: 1, level: 0, unlocked: false })
      expect(family.value).toBeUndefined()
      expect(family.next).toBeUndefined()
      expect(family.tiers).toHaveLength(1)
    })

    it('reports level 1 for an unlocked granted badge', () => {
      const user = makeUser({ grantedAchievements: ['bug-hunter'] })
      const family = resolveBadges({ user, cubes: [] }).families.find((f) => f.id === 'bug-hunter')
      expect(family).toMatchObject({ level: 1, maxLevel: 1, unlocked: true })
    })
  })
})

describe('config integrity', () => {
  const result = resolveBadges({ user: makeUser(), cubes: [] })
  const tiers = result.families.flatMap((f) => f.tiers)

  it('keeps families in their intended order', () => {
    expect(result.families.map((f) => f.id)).toEqual(FAMILY_ORDER)
  })

  it('counts tiers and families', () => {
    expect(tiers).toHaveLength(TOTAL_TIERS)
    expect(result.totalTiers).toBe(TOTAL_TIERS)
    expect(result.families).toHaveLength(TOTAL_FAMILIES)
  })

  it('names every tier after the threshold it encodes', () => {
    for (const achievement of ACHIEVEMENTS_CONFIG) {
      if (!isTiered(achievement)) continue
      const prefix = TIER_PREFIX[achievement.id]
      expect(prefix, `${achievement.id} has no known prefix`).toBeTruthy()

      // Time ladders are stored in ms but named in seconds.
      const inIdUnits = (ms: number) => (achievement.formatValue ? ms / 1000 : ms)
      const expected = achievement.tiers.map((t) => `${prefix}-${inIdUnits(t.threshold)}`)
      expect(
        achievement.tiers.map((t) => t.id),
        `${achievement.id} ids drifted from thresholds`
      ).toEqual(expected)
    }
  })

  it('caps every ladder at ten rungs', () => {
    for (const family of result.families) {
      expect(family.maxLevel, `${family.id} is deeper than ${MAX_LADDER_DEPTH}`).toBeLessThanOrEqual(MAX_LADDER_DEPTH)
    }
  })

  it('opens every ladder on a rung a newcomer can reach', () => {
    for (const achievement of ACHIEVEMENTS_CONFIG) {
      if (!isTiered(achievement)) continue

      if (GENERATED.has(achievement.id)) {
        const opening = achievement.tiers[0].threshold
        // A speed ladder must open on a time a beginner can hit; a volume one
        // within a handful of sessions.
        if (achievement.compare === 'lt')
          expect(opening, `${achievement.id} opens too fast`).toBeGreaterThanOrEqual(6_000)
        else expect(opening, `${achievement.id} opens too high`).toBeLessThanOrEqual(50)
        continue
      }

      expect(achievement.tiers[0].threshold, `${achievement.id} opens too high`).toBe(OPENING_THRESHOLD[achievement.id])
    }
  })

  it('keeps every tier id globally unique', () => {
    const ids = tiers.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('never collides a family id with a tier id', () => {
    const tierIds = new Set(tiers.map((t) => t.id))
    expect(result.families.filter((f) => f.maxLevel > 1 && tierIds.has(f.id))).toEqual([])
  })

  it('orders every ladder from easiest to hardest', () => {
    for (const achievement of ACHIEVEMENTS_CONFIG) {
      if (!isTiered(achievement)) continue
      const ascending = achievement.compare === 'gte' || achievement.compare === 'gt'
      const thresholds = achievement.tiers.map((t) => t.threshold)
      const sorted = [...thresholds].sort((a, b) => (ascending ? a - b : b - a))
      expect(thresholds, `${achievement.id} ladder is out of order`).toEqual(sorted)
    }
  })

  it('never repeats a threshold within a ladder', () => {
    for (const achievement of ACHIEVEMENTS_CONFIG) {
      if (!isTiered(achievement)) continue
      const thresholds = achievement.tiers.map((t) => t.threshold)
      expect(new Set(thresholds).size, `${achievement.id} has a duplicate threshold`).toBe(thresholds.length)
    }
  })

  it('numbers tier levels consecutively from 1', () => {
    for (const achievement of ACHIEVEMENTS_CONFIG) {
      if (!isTiered(achievement)) continue
      const levels = achievement.tiers.map((t) => t.level)
      expect(levels, `${achievement.id} levels are not 1..n`).toEqual(levels.map((_, i) => i + 1))
    }
  })

  it('gives every tier a title, a description and a renderable icon', () => {
    expect(tiers.filter((t) => !t.icon || !t.title || !t.description)).toEqual([])
  })

  it('points every icon at a file that actually ships', () => {
    // A missing PNG is a silent 404 at runtime: the badge renders as a blank
    // circle and nothing in the type system or the unlock rules notices.
    const dir = path.join(process.cwd(), 'public', 'achievements')
    const missing = [...new Set(tiers.map((t) => t.icon))].filter((icon) => !fs.existsSync(path.join(dir, icon)))
    expect(missing).toEqual([])
  })

  it('gives every counting ladder a unit for its progress readout', () => {
    for (const achievement of ACHIEVEMENTS_CONFIG) {
      if (!isTiered(achievement) || achievement.formatValue) continue
      expect(achievement.unit, `${achievement.id} has no unit`).toBeTruthy()
    }
  })
})
