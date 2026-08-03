import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { Cube } from '@/entities/cube/model/types'
import { ACHIEVEMENTS_CONFIG } from '@/entities/achievement/model/achievements'
import { resolveBadges, BadgeFamily } from '@/entities/achievement/model/resolve-badges'
import { isTiered } from '@/entities/achievement/model/types'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'
import { makeUser } from './fixtures/user'

const LEGACY_BADGE_ORDER = [
  'public-sponsor',
  'contributor',
  'bug-hunter',
  'playstore-beta',
  'first-year',
  'speed-demon',
  'sub-8-3x3',
  'oh-sub-30',
  'bld-success',
  'over-9999-3x3',
  'career-100k',
  'collector-5',
  'collector',
  'collector-50',
  'eventglot',
  'marathonist',
  'streak-30',
  'consistency-is-key',
  'zen-master',
  'new-year-solve',
  'bookmarker',
  'commentator',
  'smart-mover'
]

const TOTAL_TIERS = 92
const TOTAL_FAMILIES = 19
const MAX_LADDER_DEPTH = 10

function familyFor(id: string, cubes: Cube[]): BadgeFamily {
  const family = resolveBadges({ user: makeUser(), cubes }).families.find((f) => f.id === id)
  if (!family) throw new Error(`no family ${id}`)
  return family
}

function tierUnlocked(id: string, cubes: Cube[]): boolean {
  const badge = resolveBadges({ user: makeUser(), cubes }).badges.find((b) => b.id === id)
  if (!badge) throw new Error(`no tier ${id}`)
  return badge.unlocked
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

    it('inherits artwork from the rung below until a tier declares its own', () => {
      // Tiers I-IV share the family icon; V and VI each introduce a new one.
      expect(familyFor('cube-collection', emptyCubes(1)).icon).toBe('icons8-shield-50.png')
      expect(familyFor('cube-collection', emptyCubes(10)).icon).toBe('icons8-shield-50.png')
      expect(familyFor('cube-collection', emptyCubes(25)).icon).toBe('icons8-money-box-50.png')
      expect(familyFor('cube-collection', emptyCubes(60)).icon).toBe('icons8-monster-face-50.png')
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

    it('keeps the legacy rungs exclusive, matching the original rule', () => {
      expect(tierUnlocked('speed-demon', cubeAt(10_000))).toBe(false)
      expect(tierUnlocked('speed-demon', cubeAt(9_999))).toBe(true)
      expect(tierUnlocked('sub-8-3x3', cubeAt(8_000))).toBe(false)
      expect(tierUnlocked('sub-8-3x3', cubeAt(7_999))).toBe(true)
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

  it('keeps every pre-ladder badge, in its original relative order', () => {
    const legacy = new Set(LEGACY_BADGE_ORDER)
    expect(result.badges.filter((b) => legacy.has(b.id)).map((b) => b.id)).toEqual(LEGACY_BADGE_ORDER)
  })

  it('groups the tiers into families without changing the family count', () => {
    expect(result.total).toBe(TOTAL_TIERS)
    expect(result.badges).toHaveLength(TOTAL_TIERS)
    expect(result.families).toHaveLength(TOTAL_FAMILIES)
  })

  it('caps every ladder at ten rungs', () => {
    for (const family of result.families) {
      expect(family.maxLevel, `${family.id} is deeper than ${MAX_LADDER_DEPTH}`).toBeLessThanOrEqual(MAX_LADDER_DEPTH)
    }
  })

  it('opens every ladder on a rung a newcomer can reach', () => {
    // Nothing should demand more than a first session to get off level zero.
    const ceilings: Record<string, number> = {
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
      'smart-cube': 1
    }

    for (const achievement of ACHIEVEMENTS_CONFIG) {
      if (!isTiered(achievement)) continue
      expect(achievement.tiers[0].threshold, `${achievement.id} opens too high`).toBe(ceilings[achievement.id])
    }
  })

  it('keeps every tier id globally unique', () => {
    const ids = result.badges.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('never collides a family id with a tier id', () => {
    const tierIds = new Set(result.badges.map((b) => b.id))
    const collisions = result.families.filter((f) => f.maxLevel > 1 && tierIds.has(f.id))
    expect(collisions).toEqual([])
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
    expect(result.badges.filter((b) => !b.icon || !b.title || !b.description)).toEqual([])
  })

  it('points every icon at a file that actually ships', () => {
    // A missing PNG is a silent 404 at runtime: the badge renders as a blank
    const dir = path.join(process.cwd(), 'public', 'achievements')
    const missing = [...new Set(result.badges.map((b) => b.icon))].filter(
      (icon) => !fs.existsSync(path.join(dir, icon))
    )
    expect(missing).toEqual([])
  })

  it('gives every counting ladder a unit for its progress readout', () => {
    for (const achievement of ACHIEVEMENTS_CONFIG) {
      if (!isTiered(achievement) || achievement.formatValue) continue
      expect(achievement.unit, `${achievement.id} has no unit`).toBeTruthy()
    }
  })
})
