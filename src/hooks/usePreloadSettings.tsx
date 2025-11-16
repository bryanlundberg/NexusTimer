import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSettingsModalStore } from '@/store/SettingsModalStore'
import { useTimerStore } from '@/store/timerStore'
import { useNXData } from '@/hooks/useNXData'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { BackupLoadMode } from '@/enums/BackupLoadMode'
import { Card } from '@/components/ui/card'
import { useSyncStore } from '@/store/SyncStore'
import moment from 'moment'
import { useIsOnline } from 'react-use-is-online'
import { useSyncBackup } from '@/shared/model/backup/useSyncBackup'
import { useUser } from '@/entities/user/model/useUser'

export function usePreloadSettings() {
  const setCubes = useTimerStore((store) => store.setCubes)
  const cubes = useTimerStore((store) => store.cubes)
  const setSelectedCube = useTimerStore((store) => store.setSelectedCube)
  const setNewScramble = useTimerStore((store) => store.setNewScramble)
  const settings = useSettingsModalStore((store) => store.settings)
  const [isMounted, setIsMounted] = useState(false)
  const { getAllCubes, getCubeById } = useNXData()
  const { data: session } = useSession()
  const { handleDownloadData, handleUploadBackup } = useSyncBackup()
  const firstLoaded = useSyncStore((store) => store.firstLoaded)
  const setFirstLoaded = useSyncStore((store) => store.setFirstLoaded)
  const { data: user } = useUser(session?.user?.id!)
  const SYNC_TOAST_ID = useMemo(() => 'sync-toast-id', [])
  const { isOffline } = useIsOnline()

  useEffect(() => {
    const loadData = async () => {
      const cubes = await getAllCubes()
      const defaultCubeId = settings.preferences.defaultCube
      setCubes(cubes)

      if (defaultCubeId) {
        const defaultCube = await getCubeById(defaultCubeId)
        if (defaultCube) {
          setSelectedCube(defaultCube)
          setNewScramble(defaultCube)
        } else {
          setSelectedCube(null)
        }
      } else {
        setSelectedCube(null)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (!session?.user?.id) return

    const updateLastSeen = async () => {
      try {
        await fetch(`/api/v1/users/${session.user.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ lastSeenAt: Date.now() }),
          headers: { 'Content-Type': 'application/json' }
        })
      } catch (error) {
        console.error('Failed to update last seen at:', error)
      }
    }

    updateLastSeen()
  }, [session?.user?.id])

  useEffect(() => {
    setIsMounted(true)
  }, [])

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

  return { isMounted }
}
