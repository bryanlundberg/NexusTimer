import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import { auth } from '@/shared/config/auth/auth'
import TrainerSolve from '@/entities/trainer-solve/model/trainer-solve'
import TrainerStats from '@/entities/trainer-stats/model/trainer-stats'
import { trainerSolveInputSchema } from '@/entities/trainer-solve/model/schema'

const RECENT_TIMES_WINDOW = 12

const listQuerySchema = z.object({
  methodSlug: z.string().min(1),
  caseId: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(12)
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parsed = listQuerySchema.safeParse({
      methodSlug: request.nextUrl.searchParams.get('methodSlug'),
      caseId: request.nextUrl.searchParams.get('caseId') ?? undefined,
      limit: request.nextUrl.searchParams.get('limit') ?? undefined
    })
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query', issues: parsed.error.issues }, { status: 400 })
    }
    const { methodSlug, caseId, limit } = parsed.data

    await connectDB()

    const filter: Record<string, unknown> = { user: session.user.id, methodSlug }
    if (caseId) filter.caseId = caseId

    const solves = await TrainerSolve.find(filter).sort({ createdAt: -1 }).limit(limit).lean()
    return NextResponse.json({ solves })
  } catch (error) {
    console.error('Error listing trainer solves:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parsed = trainerSolveInputSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.issues }, { status: 400 })
    }

    const { methodSlug, caseId, timeMs, penalty } = parsed.data
    const isCounted = penalty !== 'DNF'
    const effectiveTime = penalty === '+2' ? timeMs + 2000 : timeMs

    await connectDB()

    const userId = session.user.id

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
        [`${casePath}.recentTimes`]: { $each: [effectiveTime], $slice: -RECENT_TIMES_WINDOW }
      }
    }

    await TrainerStats.findOneAndUpdate({ user: userId }, update, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    })

    return NextResponse.json({ solve }, { status: 201 })
  } catch (error) {
    console.error('Error recording trainer solve:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
