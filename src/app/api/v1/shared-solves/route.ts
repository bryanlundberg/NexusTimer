import { NextRequest } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import { requireUser } from '@/shared/api/require-user'
import { parseJsonBody } from '@/shared/api/parse-json'
import { created, ok, serverError, tooManyRequests } from '@/shared/api/responses'
import { shareSolveSchema } from '@/entities/shared-solve/model/types'
import { createSharedSolve, listMySharedIds } from '@/entities/shared-solve/server/shared-solves'
import { consumeShareQuota } from '@/entities/shared-solve/server/limits'

export async function GET() {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    await connectDB()
    return ok({ ids: await listMySharedIds(userId) })
  } catch (error) {
    return serverError('shared-solves:GET', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    const body = await parseJsonBody(request, shareSolveSchema)
    if (body instanceof Response) return body

    await connectDB()

    const existing = (await listMySharedIds(userId))[body.localSolveId]
    if (existing) return ok({ slug: existing })
    if (!(await consumeShareQuota(userId))) return tooManyRequests()

    const { slug, created: isNew } = await createSharedSolve(userId, body)
    return isNew ? created({ slug }) : ok({ slug })
  } catch (error) {
    return serverError('shared-solves:POST', error)
  }
}
