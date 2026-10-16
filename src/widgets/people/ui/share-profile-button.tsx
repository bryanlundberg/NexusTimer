'use client'

import { useTranslations } from 'next-intl'
import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useShareProfile } from '@/widgets/people/model/useShareProfile'

interface Props {
  userId: string
  name: string
}

export function ShareProfileButton({ userId, name }: Props) {
  const t = useTranslations('Index.SolvesPage')
  const shareProfile = useShareProfile(userId, name)

  return (
    <Button
      size="icon"
      variant="ghost"
      className="size-8 pointer-coarse:size-10"
      aria-label={t('share')}
      title={t('share')}
      onClick={shareProfile}
    >
      <Share2 className="size-4" />
    </Button>
  )
}
