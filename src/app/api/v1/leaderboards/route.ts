import connectDB from '@/db/mongodb';
import Solve from '@/models/solve';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();

  const leaderboards = await Solve.find().sort({ time: 1 }).limit(10).populate('user');
  return NextResponse.json(leaderboards)
}
