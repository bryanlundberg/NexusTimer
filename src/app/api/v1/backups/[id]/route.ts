import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import Backup from '@/models/backup';
import connectDB from '@/db/mongodb';

export async function GET(request: NextApiRequest, { params }: { params: Promise<{ id: string }> }) {
  const backupId = (await params).id;

  await connectDB();
  const backup = await Backup.findById(backupId);

  if (!backup) {
    return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
  }

  return NextResponse.json(backup);
}
