import { NextRequest } from 'next/server'
import { Types } from 'mongoose'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import TrainerSolve from '@/entities/trainer-solve/model/trainer-solve'
import { solvesCache, SOLVES_FIRST_PAGE_SIZE } from '@/entities/trainer-solve/model/solves-cache'
import TrainerStats from '@/entities/trainer-stats/model/trainer-stats'
import { trainerSolveInputSchema } from '@/entities/trainer-solve/model/schema'
import { TRAINER_RECENT_TIMES_WINDOW } from '@/entities/trainer-stats/model/constants'
import { requireUser } from '@/shared/api/require-user'
import { parseJsonBody } from '@/shared/api/parse-json'
import { parseSearchParams } from '@/shared/api/parse-query'
import { created, ok, serverError } from '@/shared/api/responses'
import { objectIdSchema } from '@/shared/api/zod-helpers'

const listQuerySchema = z.object({
  methodSlug: z.string().min(1),
  caseId: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  before: objectIdSchema.optional()
})

export async function GET(request: NextRequest) {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    const query = parseSearchParams(request, listQuerySchema)
    if (query instanceof Response) return query
    const { methodSlug, caseId, limit, before } = query

    const isFirstPage = !caseId && !before
    if (isFirstPage) {
      const cached = await solvesCache.getFirstPage(userId, methodSlug, limit)
      if (cached) return ok({ solves: cached })
    }

    await connectDB()

    const filter: Record<string, unknown> = { user: userId, methodSlug }
    if (caseId) filter.caseId = caseId
    if (before) filter._id = { $lt: new Types.ObjectId(before) }

    if (isFirstPage) {
      const fetchLimit = Math.max(limit, SOLVES_FIRST_PAGE_SIZE)
      const solves = await TrainerSolve.find(filter).sort({ _id: -1 }).limit(fetchLimit).lean()
      await solvesCache.prime(userId, methodSlug, solves, solves.length < SOLVES_FIRST_PAGE_SIZE)
      return ok({ solves: solves.slice(0, limit) })
    }

    const solves = await TrainerSolve.find(filter).sort({ _id: -1 }).limit(limit).lean()
    return ok({ solves })
  } catch (error) {
    return serverError('trainer/solves:GET', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    const body = await parseJsonBody(request, trainerSolveInputSchema)
    if (body instanceof Response) return body

    const { methodSlug, caseId, timeMs, penalty } = body
    const isCounted = penalty !== 'DNF'
    const effectiveTime = penalty === '+2' ? timeMs + 2000 : timeMs

    await connectDB()

    const solve = await TrainerSolve.create({
      user: userId,
      methodSlug,
      caseId,
      timeMs: effectiveTime,
      penalty
    })

    // Aggregate update — atomic in a single op so averages/records stay
    // consistent without re-reading the solves collection.
    const methodPath = `methods.${methodSlug}`
    const casePath = `${methodPath}.cases.${caseId}`

    const update: Record<string, Record<string, unknown>> = {
      $set: {
        [`${casePath}.lastSolveMs`]: effectiveTime,
        [`${casePath}.lastSolveAt`]: solve.createdAt.getTime()
      }
    }

    if (isCounted) {
      update.$inc = {
        [`${methodPath}.totalSolves`]: 1,
        [`${methodPath}.totalTimeMs`]: effectiveTime,
        [`${casePath}.totalSolves`]: 1,
        [`${casePath}.totalTimeMs`]: effectiveTime
      }
      update.$min = {
        [`${methodPath}.bestSingleMs`]: effectiveTime,
        [`${casePath}.bestSingleMs`]: effectiveTime
      }
      update.$push = {
        [`${casePath}.recentTimes`]: { $each: [effectiveTime], $slice: -TRAINER_RECENT_TIMES_WINDOW }
      }
    }

    await TrainerStats.findOneAndUpdate({ user: userId }, update, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    })

    await solvesCache.push(userId, methodSlug, solve.toJSON())

    return created({ solve })
  } catch (error) {
    return serverError('trainer/solves:POST', error)
  }
}
