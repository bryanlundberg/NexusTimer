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

function familyFor(id: string, cubes: Cube[]): BadgeFamily {
  const family = resolveBadges({ user: makeUser(), cubes }).families.find((f) => f.id === id)
  if (!family) throw new Error(`no family ${id}`)
  return family
}

const emptyCubes = (n: number) => Array.from({ length: n }, () => makeCube())
const cubeAt = (ms: number) => [makeCube({ allSolves: [makeSolve({ time: ms, startTime: Date.now() })] })]

describe('tier ladders', () => {
  describe('ascending metric (cube-collection)', () => {
    it('sits at level 0 and points at the first rung when empty', () => {
      const family = familyFor('cube-collection', [])
      expect(family.unlocked).toBe(false)
      expect(family.level).toBe(0)
      expect(family.value).toBe(0)
      expect(family.next).toBe(5)
      expect(family.title).toBe('Starter Pack')
    })

    it('climbs a rung at each threshold and advertises the one after it', () => {
      expect(familyFor('cube-collection', emptyCubes(5))).toMatchObject({ level: 1, next: 25, title: 'Starter Pack' })
      expect(familyFor('cube-collection', emptyCubes(30))).toMatchObject({
        level: 2,
        next: 50,
        title: 'Puzzle Collector'
      })
    })

    it('drops `next` once the ladder is topped out', () => {
      const family = familyFor('cube-collection', emptyCubes(60))
      expect(family).toMatchObject({ level: 3, maxLevel: 3, title: 'Cube Hoarder' })
      expect(family.next).toBeUndefined()
    })

    it('carries the icon of the tier actually held', () => {
      expect(familyFor('cube-collection', emptyCubes(5)).icon).toBe('icons8-shield-50.png')
      expect(familyFor('cube-collection', emptyCubes(60)).icon).toBe('icons8-monster-face-50.png')
    })
  })

  describe('descending metric (speed-3x3)', () => {
    it('reports an unreachable value when there are no solves', () => {
      const family = familyFor('speed-3x3', [])
      expect(family.value).toBe(Infinity)
      expect(family.level).toBe(0)
      expect(family.next).toBe(10000)
    })

    it('climbs as times shrink', () => {
      expect(familyFor('speed-3x3', cubeAt(9_500))).toMatchObject({ level: 1, next: 8000 })
      expect(familyFor('speed-3x3', cubeAt(7_500))).toMatchObject({ level: 2, maxLevel: 2 })
      expect(familyFor('speed-3x3', cubeAt(7_500)).next).toBeUndefined()
    })

    it('treats the threshold as exclusive, matching the original rule', () => {
      expect(familyFor('speed-3x3', cubeAt(10_000)).level).toBe(0)
      expect(familyFor('speed-3x3', cubeAt(9_999)).level).toBe(1)
      expect(familyFor('speed-3x3', cubeAt(8_000)).level).toBe(1)
      expect(familyFor('speed-3x3', cubeAt(7_999)).level).toBe(2)
    })
  })

  describe('non-tiered families', () => {
    it('collapses a standalone badge into a single-tier family', () => {
      const family = familyFor('eventglot', [])
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

  it('preserves the pre-refactor badge order and count', () => {
    expect(result.badges.map((b) => b.id)).toEqual(LEGACY_BADGE_ORDER)
    expect(result.total).toBe(LEGACY_BADGE_ORDER.length)
  })

  it('groups 23 tiers into 19 families', () => {
    expect(result.families).toHaveLength(19)
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

  it('numbers tier levels consecutively from 1', () => {
    for (const achievement of ACHIEVEMENTS_CONFIG) {
      if (!isTiered(achievement)) continue
      const levels = achievement.tiers.map((t) => t.level)
      expect(levels, `${achievement.id} levels are not 1..n`).toEqual(levels.map((_, i) => i + 1))
    }
  })

  it('gives every tier a renderable icon', () => {
    expect(result.badges.filter((b) => !b.icon)).toEqual([])
  })
})
