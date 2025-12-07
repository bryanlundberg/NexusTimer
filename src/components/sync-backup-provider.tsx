"use client"
import React, { useCallback, useEffect, useMemo } from 'react'
import { useInitialSyncBackup } from '@/shared/model/backup/useInitialSyncBackup'
import { useSyncBackup } from '@/shared/model/backup/useSyncBackup'
import { useSession } from 'next-auth/react'
import { useUser } from '@/entities/user/model/useUser'
import { useIsOnline } from 'react-use-is-online'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import moment from 'moment'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BackupLoadMode } from '@/entities/backup/model/enums'

export default function SyncBackupProvider({ children }: { children: React.ReactNode }) {
  const { handleDownloadData, handleUploadBackup } = useSyncBackup()
  const firstLoaded = useInitialSyncBackup((store) => store.firstLoaded)
  const setFirstLoaded = useInitialSyncBackup((store) => store.setFirstLoaded)
  const { data: session } = useSession()
  const { data: user } = useUser(session?.user?.id!)
  const SYNC_TOAST_ID = useMemo(() => 'sync-toast-id', [])
  const { isOffline } = useIsOnline()
  const settings = useSettingsStore((store) => store.settings)
  const cubes = useTimerStore((store) => store.cubes)
  const updateSetting = useSettingsStore((store) => store.updateSetting)

  const handleSync = useCallback(
    async (mode: BackupLoadMode) => {
      toast.dismiss(SYNC_TOAST_ID)
      try {
        await handleDownloadData({ mode, user })
        await handleUploadBackup()
      } catch (error) {
        console.error('Sync error:', error)
      }
    },
    [handleDownloadData, handleUploadBackup, user, SYNC_TOAST_ID]
  )

  useEffect(() => {
    if (isOffline) return
    if (!session?.user?.id) return

    const hasReachedBackupInterval = Number(settings.sync.backupInterval) <= Number(settings.sync.totalSolves)
    const isAutoSaveEnabled = settings.sync.autoSaveEnabled
    const solvesIntervalReached = hasReachedBackupInterval && isAutoSaveEnabled
    const shouldShowToast =
      (!firstLoaded &&
        settings.sync.autoLoadEnabled &&
        user &&
        cubes?.length &&
        (cubes.some((cube) => cube.solves.all.length > 0) || cubes.some((cube) => cube.solves.session.length > 0))) ||
      solvesIntervalReached

    if (!shouldShowToast) return

    if (!moment(settings.sync.lastSync || 0).isBefore(moment().subtract(5, 'minutes'))) {
      setFirstLoaded(true)
      return
    }

    setFirstLoaded(true)

    toast.custom(
      () => (
        <>
          <Card className="flex flex-col gap-2 p-4">
            <div className="flex flex-col gap-3">
              <div className="font-medium">Hey there! Time to Sync!</div>
              <p className="text-sm text-muted-foreground">
                Merge your local data with cloud backup to sync your device and create an updated backup?
              </p>
            </div>
            <div className={'grid grid-cols-2 gap-2 mt-2 w-full'}>
              <Button
                size={'sm'}
                variant="secondary"
                className={'w-full'}
                onClick={() => {
                  setFirstLoaded(true)
                  updateSetting('sync.lastSync', Date.now())
                  updateSetting('sync.totalSolves', 0)
                  toast.dismiss(SYNC_TOAST_ID)
                }}
              >
                Cancel
              </Button>
              <Button className={'w-full'} size={'sm'} onClick={() => handleSync(BackupLoadMode.MERGE)}>
                Merge
              </Button>
            </div>
          </Card>
        </>
      ),
      { duration: Infinity, id: SYNC_TOAST_ID }
    )
  }, [
    firstLoaded,
    handleSync,
    session?.user?.id,
    settings.sync.autoLoadEnabled,
    user,
    SYNC_TOAST_ID,
    setFirstLoaded,
    cubes,
    settings?.sync.lastSync,
    settings?.sync.backupInterval,
    settings?.sync.totalSolves,
    isOffline,
    settings?.sync.autoSaveEnabled
  ])

  return <>{children}</>
}
