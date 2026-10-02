import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import useAlert from '@/shared/model/useAlert'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { clearCachedSession } from '@/shared/lib/authSessionCache'
import { authClient } from '@/shared/config/auth/auth-client'
import { useSession } from '@/shared/model/useSession'

export default function useLogout() {
  const t = useTranslations('Index')
  const { data: session } = useSession()
  const alert = useAlert()

  const handleResetDeviceData = async () => {
    try {
      const confirm = await alert({
        title: t('SettingsPage.unlink-account'),
        subtitle:
          t('SettingsPage.unlink-account-para1') +
          ' ' +
          (session?.user?.name || '') +
          '. ' +
          t('SettingsPage.unlink-account-para2'),
        confirmText: t('Inputs.continue'),
        cancelText: t('Inputs.cancel')
      })

      if (!confirm) return

      const { error } = await authClient.signOut()
      if (error) throw new Error(error.message ?? 'Sign out failed, keeping local data')

      await cubesDB.clear()
      await clearCachedSession()
      window.location.assign('/app')
    } catch (error) {
      console.error('Error resetting device data:', error)
      toast.error('Error unlinking account')
    }
  }

  return {
    handleResetDeviceData
  }
}
