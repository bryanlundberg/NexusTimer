import { NextRequest } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import TrainerSolve from '@/entities/trainer-solve/model/trainer-solve'
import { solvesCache } from '@/entities/trainer-solve/model/solves-cache'
import { recomputeCaseAndMethod } from '@/entities/trainer-stats/model/recompute'
import { requireUser } from '@/shared/api/require-user'
import { notFound, ok, serverError } from '@/shared/api/responses'

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
