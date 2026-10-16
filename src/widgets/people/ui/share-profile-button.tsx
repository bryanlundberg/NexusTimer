'use client'

import { useTranslations } from 'next-intl'
import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useShareProfile } from '@/widgets/people/model/useShareProfile'

interface Props {
  userId: string
  name: string
  labeled?: boolean
}

export function ShareProfileButton({ userId, name, labeled = false }: Props) {
  const t = useTranslations('Index.SolvesPage')
  const shareProfile = useShareProfile(userId, name)

  if (labeled) {
    return (
      <Button size="sm" variant="ghost" className="gap-1.5 pointer-coarse:h-10" onClick={shareProfile}>
        <Share2 className="size-4" />
        {t('share')}
      </Button>
    )
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      className="size-9 pointer-coarse:size-10"
      aria-label={t('share')}
      title={t('share')}
      onClick={shareProfile}
    >
      <Share2 className="size-4" />
    </Button>
  )
}
