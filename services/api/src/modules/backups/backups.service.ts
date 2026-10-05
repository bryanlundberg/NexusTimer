import { gunzipSync } from 'node:zlib'
import {
  type BackupDeleteResponse,
  type BackupFile,
  type CurrentBackup,
  USER_STATS_VERSION
} from '@nexustimer/contracts'
import { computeUserStats, isValidTimezone, prepareBackupCubes } from '@nexustimer/stats'
import type { Storage } from '../../infra/storage'
import type { RunInBackground } from '../../platform/background'
import type { UsersService } from '../users/users.service'
import { backupKey, listUserBackups, newBackupKey } from './backups.files'

export const MAX_BACKUP_BYTES = 32 * 1024 * 1024
const MAX_BACKUPS_RETAINED = 10
const DEFAULT_STATS_TIMEZONE = 'UTC'
const BACKUP_CACHE_CONTROL = 'public, max-age=31536000, immutable'

export type BackupPayloadError = 'empty-body' | 'malformed' | 'empty-backup' | 'too-large' | 'not-json'

export type UploadResult = { backup: CurrentBackup } | { error: BackupPayloadError | 'user-not-found' }

export type BackupsService = {
  upload(userId: string, body: Uint8Array, timezone: string | null): Promise<UploadResult>
  list(userId: string): Promise<BackupFile[]>
  remove(userId: string, file: string): Promise<BackupDeleteResponse | null>
}

type BackupsDeps = {
  storage: Storage
  users: Pick<UsersService, 'backup' | 'setBackup' | 'saveStats'>
  background: RunInBackground
  now?: () => number
}

const isGzip = (bytes: Uint8Array): boolean => bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b

const isOverLimit = (error: unknown) => (error as { code?: string } | null)?.code === 'ERR_BUFFER_TOO_LARGE'

export function decodeBackup(received: Uint8Array): { json: Buffer; backup: unknown } | { error: BackupPayloadError } {
  if (received.length === 0) return { error: 'empty-body' }

  let json: Buffer
  try {
    json = isGzip(received)
      ? gunzipSync(received, { maxOutputLength: MAX_BACKUP_BYTES })
      : Buffer.from(received.buffer, received.byteOffset, received.byteLength)
  } catch (error) {
    return { error: isOverLimit(error) ? 'too-large' : 'malformed' }
  }

  if (json.length === 0) return { error: 'empty-backup' }
  if (json.length > MAX_BACKUP_BYTES) return { error: 'too-large' }

  try {
    return { json, backup: JSON.parse(json.toString('utf8')) }
  } catch {
    return { error: 'not-json' }
  }
}

export function createBackupsService({
  storage,
  users,
  background,
  now = () => Date.now()
}: BackupsDeps): BackupsService {
  async function prune(userId: string) {
    const stale = (await listUserBackups(storage, userId)).slice(MAX_BACKUPS_RETAINED)
    if (stale.length > 0) await storage.delete(stale.map((backup) => backup.key))
  }

  return {
    async upload(userId, body, timezone) {
      const decoded = decodeBackup(body)
      if ('error' in decoded) return decoded

      const updatedAt = now()
      const key = newBackupKey(userId, updatedAt)
      await storage.upload(key, decoded.json, { contentType: 'application/json', cacheControl: BACKUP_CACHE_CONTROL })

      const backup = { url: storage.url(key), updatedAt }
      if (!(await users.setBackup(userId, backup))) return { error: 'user-not-found' }

      background('backups:prune', () => prune(userId))
      background('backups:stats', async () => {
        const summary = computeUserStats(
          prepareBackupCubes(decoded.backup),
          timezone && isValidTimezone(timezone) ? timezone : DEFAULT_STATS_TIMEZONE
        )
        await users.saveStats(userId, { version: USER_STATS_VERSION, backupUpdatedAt: updatedAt, summary })
      })

      return { backup }
    },

    async list(userId) {
      const [current, backups] = await Promise.all([users.backup(userId), listUserBackups(storage, userId)])
      return backups.map(({ id, createdAt, size, url }) => ({
        id,
        createdAt,
        size,
        url,
        isCurrent: !!current && url === current.url
      }))
    },

    async remove(userId, file) {
      const key = backupKey(userId, file)
      if (!(await storage.exists(key))) return null

      const deletedUrl = storage.url(key)
      await storage.delete(key)

      let current = await users.backup(userId)

      if (current?.url === deletedUrl) {
        const [newest] = await listUserBackups(storage, userId)
        current = newest ? { url: newest.url, updatedAt: newest.createdAt } : null
        await users.setBackup(userId, current)
      }

      return { deleted: file, current }
    }
  }
}
