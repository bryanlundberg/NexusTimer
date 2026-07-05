'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useIsOnline } from 'react-use-is-online'
import { useUser } from '@/entities/user/model/useUser'
import { useSyncBackup } from '@/shared/model/backup/useSyncBackup'
import { useInitialSyncBackup } from '@/shared/model/backup/useInitialSyncBackup'

export const useAutoRestoreOnLogin = () => {
  const { handleDownloadData } = useSyncBackup()
  const firstLoaded = useInitialSyncBackup((store) => store.firstLoaded)
  const setFirstLoaded = useInitialSyncBackup((store) => store.setFirstLoaded)
  const { data: session } = useSession()
  const { data: user } = useUser(session?.user?.id!)
  const { isOffline } = useIsOnline()

  useEffect(() => {
    if (isOffline) return
    if (firstLoaded) return
    if (!session?.user?.id) return
    if (!user?.backup?.url) return

    setFirstLoaded(true)

    handleDownloadData({ user })
  }, [firstLoaded, handleDownloadData, session?.user?.id, user, setFirstLoaded, isOffline])
}
