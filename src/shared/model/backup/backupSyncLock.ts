const LOCK_NAME = 'nx-backup-sync'

export function withBackupSyncLock<T>(task: () => Promise<T>): Promise<T> {
  if (typeof navigator === 'undefined' || !navigator.locks) return task()
  return navigator.locks.request(LOCK_NAME, task)
}
