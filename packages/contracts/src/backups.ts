export interface BackupFile {
  id: string
  createdAt: number
  size: number
  url: string
  isCurrent: boolean
}

export type CurrentBackup = { url: string; updatedAt: number }

export type BackupDeleteResponse = { deleted: string; current: CurrentBackup | null }

export type AvatarUploadResponse = { url: string; public_id: string }

export const BACKUP_TIMEZONE_HEADER = 'x-timezone'

export const BACKUP_SUFFIX_HEADER = 'x-backup-suffix'

export type BackupCurrentResponse = { backup: CurrentBackup | null }

export const isBackupSuffix = (value: string | null | undefined): value is string =>
  typeof value === 'string' && /^[0-9a-f]{32}$/.test(value)

export const backupFragment = (url: string): string => url.match(/-([0-9a-f]{32})\.json$/)?.[1] ?? url
