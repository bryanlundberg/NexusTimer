import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import { auth } from '@/shared/config/auth/auth'
import TrainerSolve from '@/entities/trainer-solve/model/trainer-solve'
import { TRAINER_PENALTIES } from '@/entities/trainer-solve/model/constants'
import { recomputeCaseAndMethod } from '@/entities/trainer-stats/model/recompute'

const patchBodySchema = z.object({
  penalty: z.enum(TRAINER_PENALTIES)
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const parsed = patchBodySchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.issues }, { status: 400 })
    }

    await connectDB()

    const solve = await TrainerSolve.findOne({ _id: id, user: session.user.id })
    if (!solve) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Normalize timeMs back to base before applying new penalty offset.
    const baseTime = solve.penalty === '+2' ? solve.timeMs - 2000 : solve.timeMs
    const newPenalty = parsed.data.penalty
    const newTime = newPenalty === '+2' ? baseTime + 2000 : baseTime

    solve.penalty = newPenalty
    solve.timeMs = newTime
    await solve.save()

    await recomputeCaseAndMethod(session.user.id, solve.methodSlug, solve.caseId)

    return NextResponse.json({ solve })
  } catch (error) {
    console.error('Error updating trainer solve:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    const solve = await TrainerSolve.findOneAndDelete({ _id: id, user: session.user.id })
    if (!solve) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await recomputeCaseAndMethod(session.user.id, solve.methodSlug, solve.caseId)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error deleting trainer solve:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
