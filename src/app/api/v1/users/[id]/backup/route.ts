import { NextRequest } from 'next/server'
import Backup from '@/entities/backup/model/backup'
import connectDB from '@/shared/config/mongodb/mongodb'
import _ from 'lodash'
import { notFound, ok } from '@/shared/api/responses'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = (await params).id

  await connectDB()
  const backups = await Backup.find({ user: userId })

  if (!backups.length) return notFound('Backup not found')

  const backup = _.orderBy(backups, ['index'], ['asc'])
    .map((b) => b.data)
    .join('')

  return ok({
    user: userId,
    data: backup
  })
}
