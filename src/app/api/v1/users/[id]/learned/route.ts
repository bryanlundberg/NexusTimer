import { NextRequest } from 'next/server'
import { Types } from 'mongoose'
import connectDB from '@/shared/config/mongodb/mongodb'
import TrainerLearned from '@/entities/trainer-learned/model/trainer-learned'
import { learnedCache } from '@/entities/trainer-learned/model/learned-cache'
import { badRequest, ok, serverError } from '@/shared/api/responses'

interface LearnedMethodAggregate {
  _id: string
  count: number
  caseIds: string[]
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = (await params).id
    if (!userId) return badRequest('ID is required')
    if (!Types.ObjectId.isValid(userId)) return ok({ total: 0, methods: [] })

    const cached = await learnedCache.getSummary(userId)
    if (cached) return ok(cached)

    await connectDB()

    const grouped = await TrainerLearned.aggregate<LearnedMethodAggregate>([
      { $match: { user: new Types.ObjectId(userId) } },
      { $group: { _id: '$methodSlug', count: { $sum: 1 }, caseIds: { $push: '$caseId' } } }
    ])

    const methods = grouped.map((g) => ({ methodSlug: g._id, count: g.count, caseIds: g.caseIds }))
    const total = methods.reduce((sum, m) => sum + m.count, 0)

    const summary = { total, methods }
    await learnedCache.primeSummary(userId, summary)

    return ok(summary)
  } catch (error) {
    return serverError('users/[id]/learned:GET', error)
  }
}
