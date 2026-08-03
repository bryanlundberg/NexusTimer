import mongoose from 'mongoose'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import type { UserProfile } from '@/entities/user/model/user'
import UserAchievement from '@/entities/achievement/model/user-achievement'
import AchievementRarity, { ACHIEVEMENT_RARITY_ID } from '@/entities/achievement/model/achievement-rarity'
import { resolveBadges } from '@/entities/achievement/model/resolve-badges'
import { RarityAccumulator } from '@/entities/achievement/model/rarity'
import { filterCubes } from '@/entities/cube/lib/filterCubes'
import { normalizeOldData, preventDuplicateDeleteStatus } from '@/features/manage-backup/lib/importDataFromFile'
import type { Cube } from '@/entities/cube/model/types'

const PROGRESS_EVERY = 50

interface UserRow {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  backup?: { url?: string }
}

/**
 * Rebuilds the exact cube list the profile page works with. Any divergence here
 * shows up as rarity that disagrees with the badges on screen.
 */
async function loadCubes(url: string): Promise<Cube[]> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  const json = await response.json()
  return filterCubes(preventDuplicateDeleteStatus(normalizeOldData(json)))
}

/** Every badge id a user currently holds, tiers included. */
function heldBadgeIds(user: UserProfile, cubes: Cube[]): string[] {
  return resolveBadges({ user, cubes })
    .families.flatMap((family) => family.tiers)
    .filter((tier) => tier.unlocked)
    .map((tier) => tier.id)
}

async function main() {
  const startedAt = Date.now()

  const connected = await connectDB()
  if (!connected) throw new Error('Could not connect to MongoDB — is MONGODB_URI set?')

  // Granted badges are awarded manually and live in their own collection. One
  // read up front beats a query per user.
  const grantedByUser = new Map<string, string[]>()
  const granted = await UserAchievement.find({}, { userId: 1, key: 1, _id: 0 }).lean<
    Array<{ userId: mongoose.Types.ObjectId; key: string }>
  >()
  for (const { userId, key } of granted) {
    const id = String(userId)
    const keys = grantedByUser.get(id)
    if (keys) keys.push(key)
    else grantedByUser.set(id, [key])
  }
  console.log(`Loaded granted achievements for ${grantedByUser.size} users.`)

  // Exact, not estimated: this number is the denominator, and the estimate
  // reads collection metadata that can lag behind reality.
  const registeredUsers = await User.countDocuments()

  const accumulator = new RarityAccumulator()
  const cursor = User.find({}, { _id: 1, createdAt: 1, backup: 1 }).lean<UserRow>().cursor()

  for await (const row of cursor) {
    const id = String(row._id)
    const granted = grantedByUser.get(id) ?? []
    const url = row.backup?.url
    const user = { _id: id, createdAt: row.createdAt, grantedAchievements: granted } as UserProfile

    try {
      // No backup is not the same as no badges: account age and granted keys
      // still unlock things, so an empty cube list goes through the same rules.
      const cubes = url ? await loadCubes(url) : []
      accumulator.countUser([...granted, ...heldBadgeIds(user, cubes)])
    } catch (error) {
      // A broken or unreachable backup must not take the run down with it.
      accumulator.countFailure(granted)
      console.warn(`  skipped ${id}: ${error instanceof Error ? error.message : error}`)
    }

    if (accumulator.scannedCount % PROGRESS_EVERY === 0) console.log(`  ${accumulator.scannedCount} users scanned...`)
  }

  const stats = accumulator.finalize({ registeredUsers })

  // Replace, not merge: ids dropped from the config must disappear from the
  // document rather than linger with stale counts.
  await AchievementRarity.replaceOne({ _id: ACHIEVEMENT_RARITY_ID }, stats, { upsert: true })

  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1)
  console.log(
    [
      '',
      `Done in ${seconds}s.`,
      `  scanned:    ${stats.scannedUsers}`,
      `  registered: ${stats.registeredUsers}`,
      `  failed:     ${stats.failedUsers}`,
      ''
    ].join('\n')
  )

  const ranked = Object.entries(stats.badges)
    .filter(([, entry]) => entry.holders > 0)
    .sort((a, b) => a[1].pct - b[1].pct)
    .slice(0, 10)

  if (ranked.length > 0) {
    console.log('Rarest badges anyone actually holds:')
    for (const [id, entry] of ranked) console.log(`  ${entry.pct.toFixed(2).padStart(6)}%  ${id}`)
  }

  await mongoose.disconnect()
}

main().catch(async (error) => {
  console.error(error)
  await mongoose.disconnect().catch(() => {})
  process.exit(1)
})
