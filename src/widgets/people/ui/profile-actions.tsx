'use client'

import { useRouter } from '@/shared/config/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'
import type { UserProfile } from '@/entities/user/model/user'
import type { RelationshipStatus } from '@/entities/friendship/model/types'
import { MessageLink } from '@/features/chat/ui/MessageLink'
import { FriendButton } from '@/features/friends/ui/FriendButton'
import { BlockUserMenu } from '@/features/friends/ui/BlockUserMenu'

interface Props {
  user: UserProfile
  isCurrentUser: boolean
  status?: RelationshipStatus
  canRequest?: boolean
  className?: string
  children?: React.ReactNode
}

export function ProfileActions({ user, isCurrentUser, status, canRequest, className, children }: Props) {
  const t = useTranslations('Index.PeoplePage')
  const router = useRouter()

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {isCurrentUser && (
        <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => router.push('/account')}>
          <Pencil className="size-4" />
          {t('edit-profile')}
        </Button>
      )}
      {status === 'friends' && <MessageLink userId={user._id} showLabel />}
      {status && status !== 'pending_in' && (
        <FriendButton userId={user._id} name={user.name} status={status} canRequest={canRequest} />
      )}
      {children}
      {status && status !== 'blocked' && <BlockUserMenu userId={user._id} name={user.name} />}
    </div>
  )
}
