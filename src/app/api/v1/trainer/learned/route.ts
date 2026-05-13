import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import { auth } from '@/shared/config/auth/auth'
import TrainerLearned from '@/entities/trainer-learned/model/trainer-learned'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'

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
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parsed = listQuerySchema.safeParse({ methodSlug: request.nextUrl.searchParams.get('methodSlug') })
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query', issues: parsed.error.issues }, { status: 400 })
    }

    await connectDB()

    const docs = await TrainerLearned.find({ user: session.user.id, methodSlug: parsed.data.methodSlug })
      .select({ caseId: 1, _id: 0 })
      .lean<Array<{ caseId: string }>>()

    return NextResponse.json({ caseIds: docs.map((d) => d.caseId) })
  } catch (error) {
    console.error('Error listing trainer learned:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parsed = mutateBodySchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.issues }, { status: 400 })
    }

    await connectDB()

    const { methodSlug, caseId, learned } = parsed.data
    const filter = { user: session.user.id, methodSlug, caseId }

    if (learned) {
      await TrainerLearned.updateOne(filter, { $setOnInsert: filter }, { upsert: true })
    } else {
      await TrainerLearned.deleteOne(filter)
    }

    return NextResponse.json({ ok: true, learned })
  } catch (error) {
    console.error('Error updating trainer learned:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
