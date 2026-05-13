import { UserDocument } from '@/entities/user/model/user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, ExternalLink, GitCompareIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as React from 'react'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'
import { useTranslations } from 'next-intl'
import { FlyingAvatar } from '@/features/compare-users/ui/FlyingAvatar'

export default function UserCard({ user, index }: { user: UserDocument; index: number }) {
  const t = useTranslations('Index.PeoplePage.user-card')
  const router = useRouter()
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
    <div className="grid grid-cols-[2.5rem_3rem_minmax(0,1fr)_auto] items-center gap-x-4 px-3 py-3 border-b border-border/40 last:border-b-0 hover:bg-muted/20 border-l-2 border-l-transparent hover:border-l-primary transition-colors duration-150">
      {isFlying && <FlyingAvatar src={user.image} startPos={startPos} onComplete={() => setIsFlying(false)} />}

      {/* # */}
      <span className="text-xs font-mono text-muted-foreground tabular-nums text-right select-none">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Avatar */}
      <div ref={avatarRef} className="shrink-0">
        <Avatar className="size-9 rounded-lg">
          <AvatarImage className="object-cover" src={user.image} alt={user.name} />
          <AvatarFallback className="rounded-lg text-xs font-bold">
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Name + meta */}
      <div className="min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm truncate">{user.name}</span>
          {user.pronoun && <span className="text-xs text-muted-foreground shrink-0">{user.pronoun}</span>}
          {user.goal && (
            <Badge variant="destructive" className="text-[10px] font-bold uppercase px-1.5 py-0 h-4 shrink-0">
              {user.goal}
            </Badge>
          )}
        </div>
        {user.bio && <span className="text-[10px] text-muted-foreground truncate">{user.bio}</span>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
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
        <Button size="sm" className="gap-1.5 text-xs h-8" onClick={() => router.push(`/people/${user._id}`)}>
          <span className="hidden sm:inline">{t('view-profile')}</span>
          <ExternalLink className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
