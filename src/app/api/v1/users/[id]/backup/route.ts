import { NextRequest, NextResponse } from 'next/server'
import Backup from '@/entities/backup/model/backup'
import connectDB from '@/shared/config/mongodb/mongodb'
import _ from 'lodash'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = (await params).id

  await connectDB()
  const backups = await Backup.find({ user: userId })

  if (!backups.length) {
    return NextResponse.json({ error: 'Backup not found' }, { status: 404 })
  }

  const backup = _.orderBy(backups, ['index'], ['asc'])
    .map((b) => b.data)
    .join('')

  return NextResponse.json({
    user: userId,
    data: backup
  })
}
