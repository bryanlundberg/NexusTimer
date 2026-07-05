'use client'
import { useCallback, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useIsOnline } from 'react-use-is-online'
import { useUser } from '@/entities/user/model/useUser'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useSyncBackup } from '@/shared/model/backup/useSyncBackup'

const BACKUP_INTERVAL_SOLVES = 25

export const useBackupSuggestion = () => {
  const { handleDownloadData, handleUploadBackup } = useSyncBackup()
  const { data: session } = useSession()
  const { data: user } = useUser(session?.user?.id!)
  const { isOffline } = useIsOnline()
  const settings = useSettingsStore((store) => store.settings)
  const isSyncingRef = useRef(false)

  const runAutoSync = useCallback(async () => {
    if (isSyncingRef.current) return
    isSyncingRef.current = true
    try {
      await handleDownloadData({ user })
      await handleUploadBackup()
    } catch (error) {
      console.error('Sync error:', error)
    } finally {
      isSyncingRef.current = false
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
