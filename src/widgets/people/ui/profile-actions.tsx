'use client'

import { cn } from '@/shared/lib/utils'
import type { UserProfile } from '@/entities/user/model/user'
import type { RelationshipStatus } from '@/entities/friendship/model/types'
import { MessageLink } from '@/features/chat/ui/MessageLink'
import { FriendButton } from '@/features/friends/ui/FriendButton'
import { BlockUserMenu } from '@/features/friends/ui/BlockUserMenu'
import { EditProfileButton } from '@/widgets/people/ui/edit-profile-button'
import { ShareProfileButton } from '@/widgets/people/ui/share-profile-button'

interface Props {
  user: UserProfile
  isCurrentUser: boolean
  isSignedIn: boolean
  status?: RelationshipStatus
  canRequest?: boolean
  className?: string
}

export function ProfileActions({ user, isCurrentUser, isSignedIn, status, canRequest, className }: Props) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {isCurrentUser && <EditProfileButton />}
      {status === 'friends' && <MessageLink userId={user._id} variant="ghost" showLabel />}
      {status && status !== 'pending_in' && (
        <FriendButton userId={user._id} name={user.name} status={status} canRequest={canRequest} />
      )}
      <ShareProfileButton userId={user._id} name={user.name} labeled={!isSignedIn} />
      {status && status !== 'blocked' && <BlockUserMenu userId={user._id} name={user.name} />}
    </div>
  )
}
