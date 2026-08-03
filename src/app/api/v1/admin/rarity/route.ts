import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/shared/api/require-admin'
import { parseJsonBody } from '@/shared/api/parse-json'
import { ok, serverError } from '@/shared/api/responses'
import { saveRarity } from '@/entities/achievement/model/rarity-store'

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

    await saveRarity(stats)

    return ok({ badges: Object.keys(stats.badges).length, computedAt: stats.computedAt })
  } catch (error) {
    return serverError('admin/rarity:POST', error)
  }
}
