import connectDB from '@/shared/config/mongodb/mongodb'
import Solve from '@/entities/solve/model/solve'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  await connectDB()

  const { searchParams } = new URL(request.url)
  const puzzle = searchParams.get('puzzle')
  const filter: Record<string, any> = {}
  if (puzzle) filter.puzzle = puzzle

  const leaderboards = await Solve.find(filter).sort({ time: 1, createdAt: 1 }).limit(100).populate('user')

  return NextResponse.json(leaderboards)
}
