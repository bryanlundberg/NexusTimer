'use client'

import { cn } from '@/shared/lib/utils'
import type { UserProfile } from '@/entities/user/model/user'
import type { RelationshipStatus } from '@/entities/friendship/model/types'
import { MessageLink } from '@/features/chat/ui/MessageLink'
import { FriendButton } from '@/features/friends/ui/FriendButton'
import { BlockUserMenu } from '@/features/friends/ui/BlockUserMenu'

interface Props {
  user: UserProfile
  status?: RelationshipStatus
  canRequest?: boolean
  className?: string
  children?: React.ReactNode
}

export function ProfileActions({ user, status, canRequest, className, children }: Props) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {status === 'friends' && <MessageLink userId={user._id} variant="ghost" showLabel />}
      {status && status !== 'pending_in' && (
        <FriendButton userId={user._id} name={user.name} status={status} canRequest={canRequest} />
      )}
      {children}
      {status && status !== 'blocked' && <BlockUserMenu userId={user._id} name={user.name} />}
    </div>
  )
}
