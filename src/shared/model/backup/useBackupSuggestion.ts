'use client'
import React, { useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useIsOnline } from 'react-use-is-online'
import { toast } from 'sonner'
import { useUser } from '@/entities/user/model/useUser'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useSyncBackup } from '@/shared/model/backup/useSyncBackup'
import { SYNC_TOAST_DURATION_MS, SYNC_TOAST_ID } from '@/shared/model/backup/syncPolicy'
import SyncSuggestionToast from '@/components/sync-suggestion-toast'

export const useBackupSuggestion = () => {
  const { handleDownloadData, handleUploadBackup } = useSyncBackup()
  const { data: session } = useSession()
  const { data: user } = useUser(session?.user?.id!)
  const { isOffline } = useIsOnline()
  const settings = useSettingsStore((store) => store.settings)
  const updateSetting = useSettingsStore((store) => store.updateSetting)

  const confirm = useCallback(async () => {
    toast.dismiss(SYNC_TOAST_ID)
    try {
      await handleDownloadData({ user })
      await handleUploadBackup()
    } catch (error) {
      console.error('Sync error:', error)
    }
  }, [handleDownloadData, handleUploadBackup, user])

  const dismiss = useCallback(() => {
    updateSetting('sync.lastSync', Date.now())
    updateSetting('sync.totalSolves', 0)
    toast.dismiss(SYNC_TOAST_ID)
  }, [updateSetting])

  useEffect(() => {
    if (isOffline) return
    if (!session?.user?.id) return

    const solvesIntervalReached = Number(settings.sync.backupInterval) <= Number(settings.sync.totalSolves)

    if (!solvesIntervalReached) return

    toast.custom(() => React.createElement(SyncSuggestionToast, { onConfirm: confirm, onDismiss: dismiss }), {
      duration: SYNC_TOAST_DURATION_MS,
      id: SYNC_TOAST_ID,
      style: { width: '100%' }
    })
  }, [confirm, dismiss, session?.user?.id, settings?.sync.backupInterval, settings?.sync.totalSolves, isOffline])
}
