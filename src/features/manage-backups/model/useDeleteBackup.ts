import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import useAlert from '@/shared/model/useAlert'

export function useDeleteBackup() {
  const t = useTranslations('Index')
  const alert = useAlert()
  const { mutate } = useSWRConfig()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const deleteBackup = async (id: string) => {
    const confirmed = await alert({
      title: t('SettingsPage.backup-delete-title'),
      subtitle: t('SettingsPage.backup-delete-subtitle'),
      confirmText: t('Inputs.delete'),
      cancelText: t('Inputs.cancel')
    })
    if (!confirmed) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/v1/backups?file=${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`Delete failed with status ${res.status}`)
      await mutate('/api/v1/backups')
      toast.success(t('SettingsPage.backup-deleted'))
    } catch (error) {
      console.error(error)
      toast.error(t('SettingsPage.backup-delete-error'))
    } finally {
      setDeletingId(null)
    }
  }

  return { deleteBackup, deletingId }
}
