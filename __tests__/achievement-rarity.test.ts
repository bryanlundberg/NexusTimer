import { describe, expect, it } from 'vitest'
import { RarityAccumulator, allAchievementIds } from '@/entities/achievement/model/rarity'

describe('allAchievementIds', () => {
  it('lists every tier and every standalone badge exactly once', () => {
    const ids = allAchievementIds()
    expect(ids).toHaveLength(229)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('includes both granted badges and deep tiers', () => {
    const ids = allAchievementIds()
    expect(ids).toContain('bug-hunter')
    expect(ids).toContain('speed-sub-6')
    expect(ids).toContain('streak-1000')
  })
})

describe('RarityAccumulator', () => {
  it('reports zero percent everywhere on an empty database', () => {
    const stats = new RarityAccumulator().finalize({ registeredUsers: 0 })
    expect(stats).toMatchObject({ registeredUsers: 0, scannedUsers: 0, failedUsers: 0 })
    // The guard that matters: no division by zero.
    expect(Object.values(stats.badges).every((entry) => entry.pct === 0 && entry.holders === 0)).toBe(true)
  })

  it('gives every known id an entry, held or not', () => {
    const accumulator = new RarityAccumulator()
    accumulator.countUser(['collector-1'])

    const stats = accumulator.finalize({ registeredUsers: 1 })
    expect(Object.keys(stats.badges)).toHaveLength(229)
    expect(stats.badges['collector-1']).toEqual({ holders: 1, pct: 100 })
    expect(stats.badges['speed-sub-6']).toEqual({ holders: 0, pct: 0 })
  })

  it('divides by every registered account, not by the accounts it scanned', () => {
    const accumulator = new RarityAccumulator()
    accumulator.countUser(['collector-1', 'career-10'])
    accumulator.countUser(['collector-1'])

    const stats = accumulator.finalize({ registeredUsers: 4 })
    expect(stats.scannedUsers).toBe(2)
    expect(stats.badges['collector-1'].pct).toBe(50)
    expect(stats.badges['career-10'].pct).toBe(25)
  })

  it('counts a granted badge held by someone who never logged a solve', () => {
    const accumulator = new RarityAccumulator()
    accumulator.countUser(['public-sponsor'])
    accumulator.countUser(['collector-1'])

    const stats = accumulator.finalize({ registeredUsers: 2 })
    expect(stats.badges['public-sponsor']).toEqual({ holders: 1, pct: 50 })
  })

  it('counts a holder whose backup could not be read', () => {
    const accumulator = new RarityAccumulator()
    accumulator.countFailure(['contributor'])
    accumulator.countUser([])

    const stats = accumulator.finalize({ registeredUsers: 2 })
    expect(stats).toMatchObject({ scannedUsers: 2, failedUsers: 1 })
    expect(stats.badges['contributor']).toEqual({ holders: 1, pct: 50 })
  })

  it('ignores keys that are no longer part of the config', () => {
    const accumulator = new RarityAccumulator()
    accumulator.countUser(['retired-badge'])

    expect(accumulator.finalize({ registeredUsers: 1 }).badges['retired-badge']).toBeUndefined()
  })

  it('counts a badge once even when it arrives twice', () => {
    const accumulator = new RarityAccumulator()
    // Granted keys reach `resolveBadges`, so they come back in the earned list
    // too. Counting them from both sides would double their holders.
    accumulator.countUser(['bug-hunter', 'bug-hunter', 'collector-1'])

    expect(accumulator.finalize({ registeredUsers: 4 }).badges['bug-hunter']).toEqual({ holders: 1, pct: 25 })
  })

  it('rounds percentages to two decimals', () => {
    const accumulator = new RarityAccumulator()
    accumulator.countUser(['collector-1'])

    expect(accumulator.finalize({ registeredUsers: 3 }).badges['collector-1'].pct).toBe(33.33)
  })

  it('keeps a rare badge visible rather than rounding it to zero', () => {
    const accumulator = new RarityAccumulator()
    accumulator.countUser(['speed-sub-6'])

    const entry = accumulator.finalize({ registeredUsers: 10000 }).badges['speed-sub-6']
    expect(entry).toEqual({ holders: 1, pct: 0.01 })
  })

  it('tracks progress without building the full report', () => {
    const accumulator = new RarityAccumulator()
    accumulator.countUser([])
    accumulator.countUser([])
    accumulator.countFailure([])
    expect(accumulator.scannedCount).toBe(3)
  })

  it('records the moment it was computed', () => {
    const at = new Date('2026-08-02T10:00:00Z')
    expect(new RarityAccumulator().finalize({ registeredUsers: 0, computedAt: at }).computedAt).toBe(at)
  })
})
