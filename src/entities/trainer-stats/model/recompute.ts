import { Types } from 'mongoose'
import TrainerSolve from '@/entities/trainer-solve/model/trainer-solve'
import TrainerStats from '@/entities/trainer-stats/model/trainer-stats'
import type { TrainerCaseStatsDoc } from '@/entities/trainer-stats/model/types'
import { TRAINER_RECENT_TIMES_WINDOW } from '@/entities/trainer-stats/model/constants'

/**
 * Recomputes case-level + method-level aggregates from the solves collection
 * for a single (user, method, case). Used after destructive mutations
 * (delete) where $inc/$min cannot be unwound atomically.
 */
export async function recomputeCaseAndMethod(userId: string, methodSlug: string, caseId: string) {
  // 1. Pull solves for this case (small, scoped scan).
  // _id order === insertion order; matches the { user, methodSlug, caseId, _id } index.
  const solves = await TrainerSolve.find({ user: userId, methodSlug, caseId })
    .sort({ _id: 1 })
    .lean<Array<{ _id: unknown; timeMs: number; createdAt: Date }>>()

  const counted = solves
  const lastSolve = solves[solves.length - 1]

  const caseStats: TrainerCaseStatsDoc = {
    totalSolves: counted.length,
    totalTimeMs: counted.reduce((acc, s) => acc + s.timeMs, 0),
    bestSingleMs: counted.length ? Math.min(...counted.map((s) => s.timeMs)) : null,
    lastSolveMs: lastSolve?.timeMs ?? null,
    lastSolveAt: lastSolve?.createdAt.getTime() ?? null,
    recentTimes: counted.slice(-TRAINER_RECENT_TIMES_WINDOW).map((s) => s.timeMs)
  }

  const casePath = `methods.${methodSlug}.cases.${caseId}`
  const methodPath = `methods.${methodSlug}`

  if (counted.length === 0 && solves.length === 0) {
    // No solves remain at all — drop the case entry.
    await TrainerStats.updateOne({ user: userId }, { $unset: { [casePath]: '' } })
  } else {
    await TrainerStats.updateOne({ user: userId }, { $set: { [casePath]: caseStats } }, { upsert: true })
  }

  // 2. Recompute method-level aggregates from the whole method's solves.
  const [methodAgg] = await TrainerSolve.aggregate<{
    _id: null
    totalSolves: number
    totalTimeMs: number
    bestSingleMs: number | null
  }>([
    { $match: { user: new Types.ObjectId(userId), methodSlug } },
    {
      $group: {
        _id: null,
        totalSolves: { $sum: 1 },
        totalTimeMs: { $sum: '$timeMs' },
        bestSingleMs: { $min: '$timeMs' }
      }
    }
  ])

  await TrainerStats.updateOne(
    { user: userId },
    {
      $set: {
        [`${methodPath}.totalSolves`]: methodAgg?.totalSolves ?? 0,
        [`${methodPath}.totalTimeMs`]: methodAgg?.totalTimeMs ?? 0,
        [`${methodPath}.bestSingleMs`]: methodAgg?.bestSingleMs ?? null
      }
    },
    { upsert: true }
  )
}
