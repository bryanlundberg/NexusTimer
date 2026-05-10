import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import { auth } from '@/shared/config/auth/auth'
import TrainerStats from '@/entities/trainer-stats/model/trainer-stats'
import type { TrainerMethodStatsDoc } from '@/entities/trainer-stats/model/types'

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
