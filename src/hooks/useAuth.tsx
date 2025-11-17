import { signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useNXData } from '@/hooks/useNXData'
import { useTranslations } from 'next-intl'
import useAlert from '@/shared/model/useAlert'

export default function useAuth() {
  const t = useTranslations('Index')
  const { clearCubes } = useNXData()
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

      await clearCubes()
      await signOut({ redirectTo: '/' })
    } catch (error) {
      console.error('Error resetting device data:', error)
      toast.error('Error unlinking account')
    }
  }

  return {
    handleResetDeviceData
  }
}
