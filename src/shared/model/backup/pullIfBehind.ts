import { backupFragment, type BackupCurrentResponse, type CurrentBackup } from '@nexustimer/contracts'
import type { ApplyRemoteResult } from '@/shared/model/backup/applyRemoteBackup'
import { withBackupSyncLock } from '@/shared/model/backup/backupSyncLock'
import { readSyncMarker } from '@/shared/model/backup/syncMarker'

export type PullResult = ApplyRemoteResult | { status: 'none' } | { status: 'current' }

export async function fetchCurrentBackup(): Promise<CurrentBackup | null> {
  const res = await fetch('/api/v1/backups/current', { cache: 'no-store' })
  if (!res.ok) throw new Error(`GET /backups/current failed (${res.status})`)
  return ((await res.json()) as BackupCurrentResponse).backup
}

export const isBehind = (backup: CurrentBackup | null, marker: string | null): backup is CurrentBackup =>
  !!backup && backupFragment(backup.url) !== marker

export function pullIfBehind(userId: string, known?: CurrentBackup): Promise<PullResult> {
  return withBackupSyncLock(async () => {
    let backup: CurrentBackup | null
    try {
      backup = known ?? (await fetchCurrentBackup())
    } catch (error) {
      console.error(error)
      return { status: 'unreachable' }
    }

    if (!backup) return { status: 'none' }
    if (!isBehind(backup, await readSyncMarker(userId))) return { status: 'current' }

    const { applyRemoteBackup } = await import('@/shared/model/backup/applyRemoteBackup')
    return applyRemoteBackup(userId, backup)
  })
}

export async function forcePull(userId: string, backup: CurrentBackup): Promise<ApplyRemoteResult> {
  return withBackupSyncLock(async () => {
    const { applyRemoteBackup } = await import('@/shared/model/backup/applyRemoteBackup')
    return applyRemoteBackup(userId, backup)
  })
}
