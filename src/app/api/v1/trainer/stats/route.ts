import { NextRequest } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import TrainerStats from '@/entities/trainer-stats/model/trainer-stats'
import type { TrainerMethodStatsDoc } from '@/entities/trainer-stats/model/types'
import { TRAINER_TARGET_OPTIONS } from '@/features/trainer/lib/constants'
import { requireUser } from '@/shared/api/require-user'
import { parseJsonBody } from '@/shared/api/parse-json'
import { ok, serverError } from '@/shared/api/responses'

const TARGET_SET: ReadonlySet<number> = new Set(TRAINER_TARGET_OPTIONS)
const updateTargetSchema = z.object({
  method: z.string().min(1),
  targetSeconds: z.number().refine((n) => TARGET_SET.has(n), 'targetSeconds must be 1–5')
})

export async function GET(request: NextRequest) {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    await connectDB()

    const methodSlug = request.nextUrl.searchParams.get('method')

    const doc = await TrainerStats.findOne({ user: userId }).lean<{ methods: Record<string, TrainerMethodStatsDoc> }>()
    const methods = doc?.methods ?? {}

    if (methodSlug) {
      return ok({ method: methodSlug, stats: methods[methodSlug] ?? null })
    }

    return ok({ methods })
  } catch (error) {
    return serverError('trainer/stats:GET', error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    const body = await parseJsonBody(request, updateTargetSchema)
    if (body instanceof Response) return body

    await connectDB()

    await TrainerStats.findOneAndUpdate(
      { user: userId },
      { $set: { [`methods.${body.method}.targetSeconds`]: body.targetSeconds } },
      { upsert: true }
    )

    return ok({ ok: true })
  } catch (error) {
    return serverError('trainer/stats:PATCH', error)
  }
}
