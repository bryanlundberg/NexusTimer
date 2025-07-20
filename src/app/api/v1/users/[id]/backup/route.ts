import { NextRequest, NextResponse } from 'next/server';
import Backup from '@/models/backup';
import connectDB from '@/db/mongodb';
import { auth } from '@/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = (await params).id;

  const session = await auth();
  if (!session || session.user.id !== userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const backup = await Backup.findOne({ user: userId});

  if (!backup) {
    return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
  }

  return NextResponse.json(backup);
}
