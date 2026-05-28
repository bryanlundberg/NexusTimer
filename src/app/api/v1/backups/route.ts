import { NextRequest } from 'next/server'
import { auth } from '@/shared/config/auth/auth'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import { files } from '@/shared/config/files'
import { notFound, ok, serverError, unauthorized } from '@/shared/api/responses'

const MAX_BACKUP_BYTES = 32 * 1024 * 1024

const compactIso = (timestamp: number) =>
  new Date(timestamp)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const blob = await request.blob()
    if (blob.size === 0) return serverError('backups:POST', new Error('Empty body'))
    if (blob.size > MAX_BACKUP_BYTES) return serverError('backups:POST', new Error('Backup too large'))

    const userId = session.user.id
    const updatedAt = Date.now()
    const key = `backups/${userId}/${compactIso(updatedAt)}.txt`

    await files.upload(key, blob, {
      contentType: 'application/octet-stream',
      cacheControl: 'public, max-age=31536000, immutable'
    })

    const url = await files.url(key)

    await connectDB()
    const user = await User.findByIdAndUpdate(userId, { backup: { url, updatedAt } }, { new: true })
    if (!user) return notFound('User not found')

    return ok({ url, updatedAt })
  } catch (error) {
    return serverError('backups:POST', error)
  }
}
