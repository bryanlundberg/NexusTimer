import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { profilePath } from '@nexustimer/contracts'

export function useShareProfile(userId: string, name: string, username?: string) {
  const t = useTranslations('Index.SharedSolves')

  return async () => {
    const url = `${window.location.origin}${profilePath(userId, username)}`

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
