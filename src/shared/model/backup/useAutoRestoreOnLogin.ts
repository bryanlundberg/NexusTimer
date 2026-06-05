'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useIsOnline } from 'react-use-is-online'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useUser } from '@/entities/user/model/useUser'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useSyncBackup } from '@/shared/model/backup/useSyncBackup'
import { useInitialSyncBackup } from '@/shared/model/backup/useInitialSyncBackup'

export const useAutoRestoreOnLogin = () => {
  const t = useTranslations('Index.SettingsPage.sync-toast')
  const { handleDownloadData } = useSyncBackup()
  const firstLoaded = useInitialSyncBackup((store) => store.firstLoaded)
  const setFirstLoaded = useInitialSyncBackup((store) => store.setFirstLoaded)
  const { data: session } = useSession()
  const { data: user } = useUser(session?.user?.id!)
  const { isOffline } = useIsOnline()
  const settings = useSettingsStore((store) => store.settings)

  useEffect(() => {
    if (isOffline) return
    if (firstLoaded) return
    if (!session?.user?.id) return
    if (!settings.sync.autoLoadEnabled) return
    if (!user?.backup?.url) return

    setFirstLoaded(true)

    handleDownloadData({ user }).then(() => {
      toast.success(t('loaded'))
    })
  }, [
    firstLoaded,
    handleDownloadData,
    session?.user?.id,
    settings.sync.autoLoadEnabled,
    user,
    setFirstLoaded,
    isOffline,
    t
  ])
}
