import { NextRequest, NextResponse } from 'next/server'
import Backup from '@/models/backup'
import connectDB from '@/db/mongodb'
import _ from 'lodash'
import { applyRateLimit, readLimiter } from '@/lib/rate-limiter'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Apply rate limiting
  const rateLimitResponse = await applyRateLimit(request, readLimiter)
  if (rateLimitResponse) return rateLimitResponse

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
