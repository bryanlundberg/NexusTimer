'use client'

import { UserDocument } from '@/entities/user/model/user'
import { CheckCircle2, GitCompareIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as React from 'react'
import { useState, useRef } from 'react'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'
import { useTranslations } from 'next-intl'
import { FlyingAvatar } from '@/features/compare-users/ui/FlyingAvatar'
import { UserListRow } from '@/entities/user/ui/UserListRow'
import { usePresenceInView } from '@/features/presence/model/usePresenceInView'
import { useSession } from 'next-auth/react'

export default function UserCard({ user }: { user: UserDocument }) {
  const t = useTranslations('Index.PeoplePage.user-card')
  const { status } = useSession()
  const isSignedIn = status === 'authenticated'
  const { ref, presence } = usePresenceInView(isSignedIn ? user._id : null)
  const addUser = useCompareUsersStore((state) => state.addUser)
  const removeUser = useCompareUsersStore((state) => state.removeUser)
  const users = useCompareUsersStore((state) => state.users)
  const isAdded = !!users.find((u) => u._id === user._id)

  const [isFlying, setIsFlying] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const avatarRef = useRef<HTMLDivElement>(null)

  const handleCompareClick = () => {
    if (!isAdded) {
      if (avatarRef.current) {
        const rect = avatarRef.current.getBoundingClientRect()
        setStartPos({ x: rect.left, y: rect.top })
        setIsFlying(true)
      }
      addUser(user)
    } else {
      removeUser(user._id)
    }
  }

  return (
    <>
      {isFlying && <FlyingAvatar src={user.image} startPos={startPos} onComplete={() => setIsFlying(false)} />}

      <UserListRow
        user={user}
        presence={isSignedIn ? presence : undefined}
        avatarRef={avatarRef}
        rootRef={ref}
        actions={
          <Button
            onClick={handleCompareClick}
            variant={isAdded ? 'secondary' : 'outline'}
            size="sm"
            className="gap-1.5 text-xs h-8"
          >
            {isAdded ? (
              <CheckCircle2 className="size-3.5 text-primary animate-in zoom-in duration-300" />
            ) : (
              <GitCompareIcon className="size-3.5" />
            )}
            <span className="hidden sm:inline">{t('compare')}</span>
          </Button>
        }
      />
    </>
  )
}
