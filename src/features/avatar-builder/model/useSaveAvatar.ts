import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import type { NexiRecipe } from '@nexustimer/contracts'
import { useSession } from '@/shared/model/useSession'
import loader from '@/shared/lib/loader'
import { refreshRealtime } from '@/features/realtime/model/realtime-bus'

export function useSaveAvatar() {
  const t = useTranslations('Index.AvatarBuilder')
  const { update } = useSession()
  const [isSaving, setIsSaving] = useState(false)

  const save = async (recipe: NexiRecipe) => {
    try {
      setIsSaving(true)
      loader.start()
      const response = await fetch('/api/v1/users/avatar/nexi', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(recipe)
      })
      if (!response.ok) {
        toast.error(t(response.status === 429 ? 'rate-limited' : 'save-error'))
        return false
      }
      await update()
      refreshRealtime()
      toast.success(t('saved'))
      return true
    } catch {
      toast.error(t('save-error'))
      return false
    } finally {
      loader.stop()
      setIsSaving(false)
    }
  }

  return { save, isSaving }
}
