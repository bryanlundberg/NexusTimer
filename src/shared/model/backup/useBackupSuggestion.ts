'use client'
import { useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useIsOnline } from '@/shared/model/useIsOnline'
import { useUser } from '@/entities/user/model/useUser'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useSyncBackup } from '@/shared/model/backup/useSyncBackup'
import { useBackupUploadStore } from '@/shared/model/backup/useBackupUploadStore'

export const BACKUP_INTERVAL_SOLVES = 20

export const useBackupSuggestion = () => {
  const { handleDownloadData, handleUploadBackup } = useSyncBackup()
  const { data: session } = useSession()
  const { data: user } = useUser(session?.user?.id!)
  const isOffline = !useIsOnline()
  const settings = useSettingsStore((store) => store.settings)

  const runAutoSync = useCallback(async () => {
    const { isSyncing, setSyncing } = useBackupUploadStore.getState()
    if (isSyncing) return
    setSyncing(true)
    try {
      if (user?.backup?.url) await handleDownloadData({ user })
      await handleUploadBackup()
    } catch (error) {
      console.error('Sync error:', error)
    } finally {
      setSyncing(false)
    }
  }, [handleDownloadData, handleUploadBackup, user])

  useEffect(() => {
    if (isOffline) return
    if (!session?.user?.id) return

    const solvesIntervalReached = BACKUP_INTERVAL_SOLVES <= Number(settings.sync.totalSolves)

    if (!solvesIntervalReached) return

    runAutoSync()
  }, [runAutoSync, session?.user?.id, settings?.sync.totalSolves, isOffline])
}
