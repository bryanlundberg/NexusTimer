import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/db/mongodb';
import User from '@/models/user';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = (await params).id;

    if (!userId) {
      return NextResponse.json({ error: 'ID is required' }, { status: 404 });
    }

    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { email, createdAt, updatedAt, __v, ...rest } = user.toObject();

    return NextResponse.json(rest);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
