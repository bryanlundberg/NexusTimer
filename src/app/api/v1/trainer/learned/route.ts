import { NextRequest } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import TrainerLearned from '@/entities/trainer-learned/model/trainer-learned'
import { learnedCache } from '@/entities/trainer-learned/model/learned-cache'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { requireUser } from '@/shared/api/require-user'
import { parseJsonBody } from '@/shared/api/parse-json'
import { parseSearchParams } from '@/shared/api/parse-query'
import { ok, serverError } from '@/shared/api/responses'

const listQuerySchema = z.object({
  methodSlug: z.string().min(1)
})

const mutateBodySchema = z
  .object({
    methodSlug: z.string().min(1),
    caseId: z.string().min(1),
    learned: z.boolean()
  })
  .superRefine((data, ctx) => {
    const set = ALGORITHM_SETS.find((s) => s.slug === data.methodSlug)
    if (!set) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['methodSlug'], message: 'Unknown methodSlug' })
      return
    }
    if (!set.algorithms.some((a) => a.id === data.caseId)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['caseId'], message: 'Unknown caseId for this method' })
    }
  })

export async function GET(request: NextRequest) {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    const query = parseSearchParams(request, listQuerySchema)
    if (query instanceof Response) return query

    const cached = await learnedCache.get(userId, query.methodSlug)
    if (cached) return ok({ caseIds: cached })

    await connectDB()

    const docs = await TrainerLearned.find({ user: userId, methodSlug: query.methodSlug })
      .select({ caseId: 1, _id: 0 })
      .lean<Array<{ caseId: string }>>()

    const caseIds = docs.map((d) => d.caseId)
    await learnedCache.prime(userId, query.methodSlug, caseIds)

    return ok({ caseIds })
  } catch (error) {
    return serverError('trainer/learned:GET', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    const body = await parseJsonBody(request, mutateBodySchema)
    if (body instanceof Response) return body

    await connectDB()

    const { methodSlug, caseId, learned } = body
    const filter = { user: userId, methodSlug, caseId }

    if (learned) {
      await TrainerLearned.updateOne(filter, { $setOnInsert: filter }, { upsert: true })
    } else {
      await TrainerLearned.deleteOne(filter)
    }

    // Write-through: Mongo is the source of truth, Redis mirrors it.
    // The profile summary is an aggregate, so it is invalidated instead.
    await Promise.all([
      learnedCache.setLearned(userId, methodSlug, caseId, learned),
      learnedCache.invalidateSummary(userId)
    ])

    return ok({ ok: true, learned })
  } catch (error) {
    return serverError('trainer/learned:POST', error)
  }
}
