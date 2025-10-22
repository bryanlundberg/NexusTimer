import connectDB from '@/db/mongodb'
import Solve from '@/models/solve'
import { NextResponse } from 'next/server'
import { applyRateLimit, readLimiter } from '@/lib/rate-limiter'

export async function GET(request: Request) {
  // Apply rate limiting
  const rateLimitResponse = await applyRateLimit(request, readLimiter)
  if (rateLimitResponse) return rateLimitResponse

  await connectDB()

  const { searchParams } = new URL(request.url)
  const puzzle = searchParams.get('puzzle')
  const filter: Record<string, any> = {}
  if (puzzle) filter.puzzle = puzzle

  const leaderboards = await Solve.find(filter).sort({ time: 1, createdAt: 1 }).limit(100).populate('user')

  return NextResponse.json(leaderboards)
}
