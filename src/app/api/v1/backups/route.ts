import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/db/mongodb';
import User from '@/models/user';
import Backup from '@/models/backup';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json()
    if (!data) return NextResponse.json({ error: 'Incorrect params' }, { status: 400 });
    await connectDB();

    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const backup = await Backup.findOneAndUpdate(
      {
        user: session.user.id,
      },
      {
        user: session.user.id,
        data: data,
      },
      {
        upsert: true,
        new: true,
      }
    );

    return NextResponse.json(backup);
  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  await connectDB();
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(0, Number(searchParams.get('page')) || 0);
  const PER_PAGE = 50

  const backups = await Backup.find().limit(PER_PAGE).skip(page * PER_PAGE).sort({ createdAt: -1 })
  const docsCount = await Backup.find().countDocuments()

  return NextResponse.json({
    events: backups,
    page: page,
    pages: Math.max(0, (docsCount / PER_PAGE) -1),
  });
}

