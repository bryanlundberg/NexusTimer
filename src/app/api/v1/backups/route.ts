import { gunzipSync } from 'node:zlib'
import { NextRequest, after } from 'next/server'
import { auth } from '@/shared/config/auth/auth'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import { userProfileCache } from '@/entities/user/model/user-cache'
import { files } from '@/shared/config/files'
import {
  backupKey,
  isValidBackupFile,
  listUserBackups,
  newBackupKey,
  pruneUserBackups
} from '@/entities/backup/model/backup-storage'
import { badRequest, notFound, ok, serverError, unauthorized } from '@/shared/api/responses'

const MAX_BACKUP_BYTES = 32 * 1024 * 1024

const MAX_BACKUPS_RETAINED = 10

/** gzip streams start with the magic bytes 0x1f 0x8b. */
const isGzip = (bytes: Uint8Array): boolean => bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const received = new Uint8Array(await request.arrayBuffer())
    if (received.length === 0) return serverError('backups:POST', new Error('Empty body'))

    let json: Buffer
    try {
      json = isGzip(received) ? gunzipSync(received) : Buffer.from(received)
    } catch {
      return badRequest('Malformed backup payload')
    }

    if (json.length === 0) return serverError('backups:POST', new Error('Empty backup'))
    if (json.length > MAX_BACKUP_BYTES) return serverError('backups:POST', new Error('Backup too large'))

    try {
      JSON.parse(json.toString('utf8'))
    } catch {
      return badRequest('Backup is not valid JSON')
    }

    const userId = session.user.id
    const updatedAt = Date.now()
    const key = newBackupKey(userId, updatedAt)

    await files.upload(key, new Blob([new Uint8Array(json)], { type: 'application/json' }), {
      contentType: 'application/json',
      cacheControl: 'public, max-age=31536000, immutable'
    })

    const url = await files.url(key)

    await connectDB()
    const user = await User.findByIdAndUpdate(userId, { backup: { url, updatedAt } }, { new: true })
    if (!user) return notFound('User not found')

    await userProfileCache.invalidate(userId)

    // Prune older backups after the response flushes so the upload stays fast.
    after(() => pruneUserBackups(userId, MAX_BACKUPS_RETAINED).catch((e) => console.error('[backups:POST:prune]', e)))

    return ok({ url, updatedAt })
  } catch (error) {
    return serverError('backups:POST', error)
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const userId = session.user.id

    await connectDB()
    const user = await User.findById(userId, { backup: 1 }).lean<{ backup?: { url: string } }>()
    const currentUrl = user?.backup?.url

    const backups = await listUserBackups(userId)

    return ok(
      backups.map(({ id, createdAt, size, url }) => ({
        id,
        createdAt,
        size,
        url,
        isCurrent: !!currentUrl && url === currentUrl
      }))
    )
  } catch (error) {
    return serverError('backups:GET', error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const userId = session.user.id
    const file = request.nextUrl.searchParams.get('file')

    if (!file || !isValidBackupFile(file)) return badRequest('Invalid backup file')

    const key = backupKey(userId, file)
    if (!(await files.exists(key))) return notFound('Backup not found')

    const deletedUrl = await files.url(key)
    await files.delete(key)

    await connectDB()
    const user = await User.findById(userId, { backup: 1 }).lean<{ backup?: { url: string; updatedAt: number } }>()

    let current: { url: string; updatedAt: number } | null = user?.backup ?? null

    // If the deleted backup was the active one, re-point it to the most recent
    // remaining backup (or clear it when none are left).
    if (user?.backup?.url === deletedUrl) {
      const [newest] = await listUserBackups(userId)
      if (newest) {
        current = { url: newest.url, updatedAt: newest.createdAt }
        await User.findByIdAndUpdate(userId, { backup: current })
      } else {
        current = null
        await User.findByIdAndUpdate(userId, { $unset: { backup: 1 } })
      }
      await userProfileCache.invalidate(userId)
    }

    return ok({ deleted: file, current })
  } catch (error) {
    return serverError('backups:DELETE', error)
  }
}
