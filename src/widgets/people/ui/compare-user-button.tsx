'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2, GitCompareIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'
import type { UserProfile } from '@/entities/user/model/user'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'
import { FlyingAvatar } from '@/features/compare-users/ui/FlyingAvatar'

export function CompareUserButton({ user, className }: { user: UserProfile; className?: string }) {
  const t = useTranslations('Index.PeoplePage.user-card')

  const addUser = useCompareUsersStore((state) => state.addUser)
  const removeUser = useCompareUsersStore((state) => state.removeUser)
  const users = useCompareUsersStore((state) => state.users)
  const isAdded = !!users.find((u) => u._id === user._id)

  const [isFlying, setIsFlying] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = () => {
    if (isAdded) {
      removeUser(user._id)
      return
    }

    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      setStartPos({ x: rect.left, y: rect.top })
      setIsFlying(true)
    }
    addUser(user)
  }

  return (
    <>
      {isFlying && <FlyingAvatar src={user.image} startPos={startPos} onComplete={() => setIsFlying(false)} />}

      <Button
        ref={buttonRef}
        variant={isAdded ? 'secondary' : 'outline'}
        size="sm"
        className={cn('gap-1.5', className)}
        onClick={handleClick}
      >
        {isAdded ? (
          <CheckCircle2 className="size-4 text-primary animate-in zoom-in duration-300" />
        ) : (
          <GitCompareIcon className="size-4" />
        )}
        {t('compare-stats')}
      </Button>
    </>
  )
}
