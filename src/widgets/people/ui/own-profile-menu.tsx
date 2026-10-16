'use client'

import { useTranslations } from 'next-intl'
import { Ellipsis, Pencil, Share2 } from 'lucide-react'
import { useRouter } from '@/shared/config/i18n/navigation'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/shared/lib/utils'
import { useShareProfile } from '@/widgets/people/model/useShareProfile'

interface Props {
  userId: string
  name: string
  className?: string
}

export function OwnProfileMenu({ userId, name, className }: Props) {
  const t = useTranslations('Index')
  const router = useRouter()
  const shareProfile = useShareProfile(userId, name)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={cn('size-9 pointer-coarse:size-10', className)}
          aria-label={t('FriendsPage.more-actions')}
        >
          <Ellipsis className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => router.push('/account')}>
          <Pencil className="size-4" />
          {t('PeoplePage.edit-profile')}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={shareProfile}>
          <Share2 className="size-4" />
          {t('SolvesPage.share')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
