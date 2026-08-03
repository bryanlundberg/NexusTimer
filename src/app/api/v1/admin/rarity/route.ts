import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/shared/api/require-admin'
import { parseJsonBody } from '@/shared/api/parse-json'
import { ok, serverError } from '@/shared/api/responses'
import connectDB from '@/shared/config/mongodb/mongodb'
import { getRedis } from '@/shared/config/redis/redis'
import AchievementRarity, { ACHIEVEMENT_RARITY_ID } from '@/entities/achievement/model/achievement-rarity'

const CACHE_KEY = 'achievement:rarity'

const entrySchema = z.object({
  holders: z.number().int().nonnegative(),
  pct: z.number().min(0).max(100)
})

const statsSchema = z.object({
  registeredUsers: z.number().int().nonnegative(),
  scannedUsers: z.number().int().nonnegative(),
  failedUsers: z.number().int().nonnegative(),
  computedAt: z.coerce.date(),
  badges: z.record(z.string(), entrySchema)
})

/** Receives a finished run from `scripts/compute-rarity.ts`. */
export async function POST(request: NextRequest) {
  const denied = requireAdmin(request)
  if (denied) return denied

  try {
    const stats = await parseJsonBody(request, statsSchema)
    if (stats instanceof Response) return stats

    await connectDB()

    await AchievementRarity.replaceOne({ _id: ACHIEVEMENT_RARITY_ID }, stats, { upsert: true })

    try {
      const redis = await getRedis()
      await redis.set(CACHE_KEY, JSON.stringify(stats))
    } catch (error) {
      console.error('rarity cache write failed:', error)
    }

    return ok({ badges: Object.keys(stats.badges).length, computedAt: stats.computedAt })
  } catch (error) {
    return serverError('admin/rarity:POST', error)
  }
}
