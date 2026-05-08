'use client'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useInitialSyncBackup } from '@/shared/model/backup/useInitialSyncBackup'
import { useSyncBackup } from '@/shared/model/backup/useSyncBackup'
import { useSession } from 'next-auth/react'
import { useUser } from '@/entities/user/model/useUser'
import { useIsOnline } from 'react-use-is-online'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import moment from 'moment'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { BackupLoadMode } from '@/entities/backup/model/enums'

const CUBE_STICKERS = [
  '#C41E3A',
  '#003EA8',
  '#FFD500',
  '#FF5800',
  '#009B48',
  '#C41E3A',
  '#FFD500',
  '#FF5800',
  '#003EA8'
]

export default function SyncBackupProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Index.SettingsPage.sync-toast')
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

  const handleSync = useCallback(async () => {
    toast.dismiss(SYNC_TOAST_ID)
    try {
      await handleDownloadData({ user })
      await handleUploadBackup()
    } catch (error) {
      console.error('Sync error:', error)
    }
  }, [handleDownloadData, handleUploadBackup, user, SYNC_TOAST_ID])

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
        <div className="w-full rounded-xl bg-card border border-border shadow-lg overflow-hidden">
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-start gap-3">
              <div className="grid grid-cols-3 gap-[3px] shrink-0 mt-0.5 p-1 rounded-md bg-muted">
                {CUBE_STICKERS.map((color, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-[2px]" style={{ background: color }} />
                ))}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="text-sm font-bold tracking-tight leading-tight">{t('title')}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{t('description')}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFirstLoaded(true)
                  updateSetting('sync.lastSync', Date.now())
                  updateSetting('sync.totalSolves', 0)
                  toast.dismiss(SYNC_TOAST_ID)
                }}
              >
                {t('cancel')}
              </Button>
              <Button className="w-full" size="sm" onClick={() => handleSync()}>
                {t('merge')}
              </Button>
            </div>
          </div>
        </div>
      ),
      { duration: 8000, id: SYNC_TOAST_ID, style: { width: '100%' } }
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
    settings?.sync.autoSaveEnabled,
    t
  ])

  return <>{children}</>
}
