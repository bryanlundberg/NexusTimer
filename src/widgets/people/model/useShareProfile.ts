import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function useShareProfile(userId: string, name: string) {
  const t = useTranslations('Index.SharedSolves')

  return async () => {
    const url = `${window.location.origin}/people/${userId}`

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: name, url })
      } catch (error) {
        if ((error as Error).name !== 'AbortError') toast.error(t('errors.generic'))
      }
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      toast.success(t('link-copied'), { description: url })
    } catch {
      toast.error(t('errors.generic'))
    }
  }
}
