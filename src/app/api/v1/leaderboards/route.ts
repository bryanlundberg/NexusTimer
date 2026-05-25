import { NextRequest } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import Solve from '@/entities/solve/model/solve'
import { ok, serverError } from '@/shared/api/responses'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const puzzle = request.nextUrl.searchParams.get('puzzle')
    const filter: Record<string, string> = {}
    if (puzzle) filter.puzzle = puzzle

    const leaderboards = await Solve.find(filter).sort({ time: 1, createdAt: 1 }).limit(100).populate('user')

    return ok(leaderboards)
  } catch (error) {
    return serverError('leaderboards:GET', error)
  }
}
