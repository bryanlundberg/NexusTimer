import { NextRequest } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import TrainerSolve from '@/entities/trainer-solve/model/trainer-solve'
import { solvesCache } from '@/entities/trainer-solve/model/solves-cache'
import { TRAINER_PENALTIES } from '@/entities/trainer-solve/model/constants'
import { recomputeCaseAndMethod } from '@/entities/trainer-stats/model/recompute'
import { requireUser } from '@/shared/api/require-user'
import { parseJsonBody } from '@/shared/api/parse-json'
import { notFound, ok, serverError } from '@/shared/api/responses'

const patchBodySchema = z.object({
  penalty: z.enum(TRAINER_PENALTIES)
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    const body = await parseJsonBody(request, patchBodySchema)
    if (body instanceof Response) return body

    const { id } = await params
    await connectDB()

    const solve = await TrainerSolve.findOne({ _id: id, user: userId })
    if (!solve) return notFound()

    // Normalize timeMs back to base before applying new penalty offset.
    const baseTime = solve.penalty === '+2' ? solve.timeMs - 2000 : solve.timeMs
    const newPenalty = body.penalty
    const newTime = newPenalty === '+2' ? baseTime + 2000 : baseTime

    solve.penalty = newPenalty
    solve.timeMs = newTime
    await solve.save()

    await recomputeCaseAndMethod(userId, solve.methodSlug, solve.caseId)
    await solvesCache.invalidate(userId, solve.methodSlug)

    return ok({ solve })
  } catch (error) {
    return serverError('trainer/solves/[id]:PATCH', error)
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    const { id } = await params
    await connectDB()

    const solve = await TrainerSolve.findOneAndDelete({ _id: id, user: userId })
    if (!solve) return notFound()

    await recomputeCaseAndMethod(userId, solve.methodSlug, solve.caseId)
    await solvesCache.invalidate(userId, solve.methodSlug)

    return ok({ ok: true })
  } catch (error) {
    return serverError('trainer/solves/[id]:DELETE', error)
  }
}
