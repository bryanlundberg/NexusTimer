import { ACHIEVEMENTS_CONFIG } from './achievements'
import { isTiered } from './types'

export interface RarityEntry {
  holders: number
  pct: number
}

export interface AchievementRarityStats {
  registeredUsers: number
  scannedUsers: number
  failedUsers: number
  computedAt: Date
  badges: Record<string, RarityEntry>
}

/** Every badge id the config can award, tiers included. */
export function allAchievementIds(): string[] {
  return ACHIEVEMENTS_CONFIG.flatMap((achievement) =>
    isTiered(achievement) ? achievement.tiers.map((tier) => tier.id) : [achievement.id]
  )
}

function percent(holders: number, population: number): number {
  if (population <= 0) return 0
  return Math.round((holders / population) * 10000) / 100
}

/**
 * Tallies badge holders one user at a time so memory stays flat regardless of
 * how many accounts the job walks through.
 */
export class RarityAccumulator {
  private readonly holders = new Map<string, number>()
  private scanned = 0
  private failed = 0

  /** Cheap counter for progress reporting `finalize` rebuilds every entry. */
  get scannedCount(): number {
    return this.scanned
  }

  /** Ids are de-duplicated: granted keys also come back out of `resolveBadges`. */
  countUser(badgeIds: readonly string[]): void {
    this.scanned++
    for (const id of new Set(badgeIds)) this.holders.set(id, (this.holders.get(id) ?? 0) + 1)
  }

  /** Records an account whose backup could not be read. Granted badges still count. */
  countFailure(granted: readonly string[]): void {
    this.countUser(granted)
    this.failed++
  }

  finalize({
    registeredUsers,
    computedAt = new Date()
  }: {
    registeredUsers: number
    computedAt?: Date
  }): AchievementRarityStats {
    const badges: Record<string, RarityEntry> = {}

    // Every known id gets an entry, including the ones nobody holds - the UI
    // should never have to distinguish "0%" from "not computed yet". Ids the
    // config no longer knows about are dropped here.
    for (const id of allAchievementIds()) {
      const holders = this.holders.get(id) ?? 0
      badges[id] = { holders, pct: percent(holders, registeredUsers) }
    }

    return {
      registeredUsers,
      scannedUsers: this.scanned,
      failedUsers: this.failed,
      computedAt,
      badges
    }
  }
}
