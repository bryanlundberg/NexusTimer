import type { Storage } from '../../infra/storage'

const BACKUPS_ROOT = 'backups'

export type StoredBackup = { key: string; id: string; createdAt: number; size: number; url: string }

/** Whether a file name is a safe, single backup segment (rejects path traversal). */
export const isValidBackupFile = (file: string): boolean => !file.includes('..') && /^[A-Za-z0-9._-]+$/.test(file)

export const backupKey = (userId: string, file: string): string => `${BACKUPS_ROOT}/${userId}/${file}`

/** Compact ISO stamp used as a backup file name (`20260606T120000Z`). */
const compactIso = (timestamp: number) =>
  new Date(timestamp)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')

export const newBackupKey = (userId: string, timestamp: number): string =>
  backupKey(userId, `${compactIso(timestamp)}.json`)

const parseCompactIso = (name: string): number | null => {
  const match = name.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/)
  if (!match) return null
  const [, y, mo, d, h, mi, s] = match
  const ms = Date.parse(`${y}-${mo}-${d}T${h}:${mi}:${s}Z`)
  return Number.isNaN(ms) ? null : ms
}

/** Every backup stored under a user's folder, newest first. */
export async function listUserBackups(storage: Storage, userId: string): Promise<StoredBackup[]> {
  const prefix = `${BACKUPS_ROOT}/${userId}/`
  const backups: StoredBackup[] = []

  for (const file of await storage.list(prefix)) {
    const id = file.key.slice(prefix.length)
    if (!id) continue
    const createdAt = parseCompactIso(id) ?? file.lastModified ?? 0
    backups.push({ key: file.key, id, createdAt, size: file.size, url: storage.url(file.key) })
  }

  return backups.sort((a, b) => b.createdAt - a.createdAt)
}
