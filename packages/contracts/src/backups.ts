export interface BackupFile {
  id: string
  createdAt: number
  size: number
  url: string
  isCurrent: boolean
}

export type CurrentBackup = { url: string; updatedAt: number }

export type BackupUploadResponse = CurrentBackup

export type BackupDeleteResponse = { deleted: string; current: CurrentBackup | null }

export type AvatarUploadResponse = { url: string; public_id: string }

export const BACKUP_TIMEZONE_HEADER = 'x-timezone'
