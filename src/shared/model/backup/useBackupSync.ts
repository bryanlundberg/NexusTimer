'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { useSession } from '@/shared/model/useSession'
import { subscribeRealtime } from '@/features/realtime/model/realtime-bus'
import { applyCubesToStore } from '@/shared/model/backup/applyCubesToStore'
import { onCubesChangedElsewhere } from '@/shared/model/backup/cubesChannel'
import { createPullScheduler } from '@/shared/model/backup/pullScheduler'
import { pullIfBehind } from '@/shared/model/backup/pullIfBehind'
import { waitForSyncWindow } from '@/shared/model/backup/waitForSyncWindow'

export function useBackupSync() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const t = useTranslations('Index.SettingsPage')
  const tRef = useRef(t)

  useEffect(() => {
    tRef.current = t
  })

  useEffect(() => {
    if (!userId) return

    const scheduler = createPullScheduler({
      ready: waitForSyncWindow,
      run: async (known) => {
        if (!navigator.onLine) return
        const result = await pullIfBehind(userId, known)
        if (result.status === 'merged' && result.added > 0) toast.success(tRef.current('backup-synced'))
      }
    })

    const reloadFromDatabase = async () => {
      await waitForSyncWindow()
      applyCubesToStore(await cubesDB.getAll())
    }

    const stopRealtime = subscribeRealtime((event) => {
      if (event.type === 'backup:updated') scheduler.request(event.backup)
      else if (event.type === 'realtime:connected') scheduler.request()
    })
    const stopTabs = onCubesChangedElsewhere(() => void reloadFromDatabase())
    const handleOnline = () => scheduler.request()

    window.addEventListener('online', handleOnline)
    scheduler.request()

    return () => {
      scheduler.dispose()
      stopRealtime()
      stopTabs()
      window.removeEventListener('online', handleOnline)
    }
  }, [userId])
}
