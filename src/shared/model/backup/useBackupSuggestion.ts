'use client'
import { useCallback, useEffect } from 'react'
import { useSession } from '@/shared/model/useSession'
import { useIsOnline } from '@/shared/model/useIsOnline'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useSyncBackup } from '@/shared/model/backup/useSyncBackup'
import { useBackupUploadStore } from '@/shared/model/backup/useBackupUploadStore'
import { pullIfBehind } from '@/shared/model/backup/pullIfBehind'

export const BACKUP_INTERVAL_SOLVES = 20

export const useBackupSuggestion = () => {
  const { handleUploadBackup } = useSyncBackup()
  const { data: session } = useSession()
  const userId = session?.user?.id
  const isOffline = !useIsOnline()
  const settings = useSettingsStore((store) => store.settings)

  const runAutoSync = useCallback(async () => {
    if (!userId) return
    const { isSyncing, setSyncing } = useBackupUploadStore.getState()
    if (isSyncing) return
    setSyncing(true)
    try {
      await pullIfBehind(userId)
      await handleUploadBackup()
    } catch (error) {
      console.error('Sync error:', error)
    } finally {
      setSyncing(false)
    }
  }, [handleUploadBackup, userId])

  useEffect(() => {
    if (isOffline) return
    if (!userId) return

    const solvesIntervalReached = BACKUP_INTERVAL_SOLVES <= Number(settings.sync.totalSolves)

    if (!solvesIntervalReached) return

    runAutoSync()
  }, [runAutoSync, userId, settings?.sync.totalSolves, isOffline])
}
