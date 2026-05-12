import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import { auth } from '@/shared/config/auth/auth'
import TrainerStats from '@/entities/trainer-stats/model/trainer-stats'
import type { TrainerMethodStatsDoc } from '@/entities/trainer-stats/model/types'
import { TRAINER_TARGET_OPTIONS } from '@/features/trainer/lib/constants'

const VALID_TARGET_SECONDS = new Set(TRAINER_TARGET_OPTIONS)

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const userId = session.user.id
    const methodSlug = request.nextUrl.searchParams.get('method')

    const doc = await TrainerStats.findOne({ user: userId }).lean<{ methods: Record<string, TrainerMethodStatsDoc> }>()
    const methods = doc?.methods ?? {}

    if (methodSlug) {
      return NextResponse.json({ method: methodSlug, stats: methods[methodSlug] ?? null })
    }

    return NextResponse.json({ methods })
  } catch (error) {
    console.error('Error fetching trainer stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { method, targetSeconds } = body

    if (typeof method !== 'string' || !method) {
      return NextResponse.json({ error: 'method is required' }, { status: 400 })
    }
    if (!VALID_TARGET_SECONDS.has(targetSeconds)) {
      return NextResponse.json({ error: 'targetSeconds must be 1–5' }, { status: 400 })
    }

    await connectDB()

    await TrainerStats.findOneAndUpdate(
      { user: session.user.id },
      { $set: { [`methods.${method}.targetSeconds`]: targetSeconds } },
      { upsert: true }
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error updating trainer target:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
