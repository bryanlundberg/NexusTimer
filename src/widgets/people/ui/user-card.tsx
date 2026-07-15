import { UserDocument } from '@/entities/user/model/user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CheckCircle2, GitCompareIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as React from 'react'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'
import { useLocale, useTranslations } from 'next-intl'
import { FlyingAvatar } from '@/features/compare-users/ui/FlyingAvatar'
import { WcaBadge } from '@/shared/ui/wca-badge/WcaBadge'
import { CountryFlag } from '@/shared/ui/country-flag/CountryFlag'
import { getCountryName } from '@/shared/lib/getCountryName'
import { PresenceDot } from '@/features/presence/ui/PresenceDot'
import { resolvePresenceDisplay, type PresenceState } from '@/features/presence/model/usePresence'

export default function UserCard({ user, presence }: { user: UserDocument; presence?: PresenceState }) {
  const t = useTranslations('Index.PeoplePage.user-card')
  const locale = useLocale()
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
    <div
      className="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[3rem_minmax(0,1fr)_7rem_7rem_7rem] items-center gap-x-4 px-3 py-3 border-b border-border/40 last:border-b-0 hover:bg-muted/20 border-l-2 border-l-transparent hover:border-l-primary transition-colors duration-150 cursor-pointer"
      onClick={() => router.push(`/people/${user._id}`)}
    >
      {isFlying && <FlyingAvatar src={user.image} startPos={startPos} onComplete={() => setIsFlying(false)} />}

      {/* Avatar */}
      <div ref={avatarRef} className="hidden sm:block shrink-0 relative">
        <Avatar className="size-9 rounded-lg">
          <AvatarImage className="object-cover" src={user.image} alt={user.name} />
          <AvatarFallback className="rounded-lg text-xs font-bold">
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="absolute -bottom-0.5 right-2 rounded-full bg-background p-px">
          <PresenceDot state={resolvePresenceDisplay(presence)} className="size-2" />
        </span>
      </div>

      {/* Name */}
      <div className="min-w-0 flex items-center gap-2">
        <div className="relative sm:hidden shrink-0">
          <Avatar className="size-8 rounded-lg">
            <AvatarImage className="object-cover" src={user.image} alt={user.name} />
            <AvatarFallback className="rounded-lg text-xs font-bold">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-background p-px">
            <PresenceDot state={resolvePresenceDisplay(presence)} className="size-2" />
          </span>
        </div>
        <span className="font-bold text-sm truncate">{user.name}</span>
        {user.wcaId && (
          <span className="sm:hidden shrink-0">
            <WcaBadge wcaId={user.wcaId} />
          </span>
        )}
      </div>

      {/* Country */}
      <div className="hidden sm:flex items-center justify-center gap-1.5 min-w-0 text-xs text-muted-foreground">
        {user.country ? (
          <>
            <CountryFlag code={user.country} className="shrink-0" />
            <span className="truncate">{getCountryName(user.country, locale)}</span>
          </>
        ) : (
          <span className="opacity-40">—</span>
        )}
      </div>

      {/* WCA */}
      <div className="hidden sm:flex items-center justify-center min-w-0 text-xs text-muted-foreground">
        {user.wcaId ? (
          <WcaBadge wcaId={user.wcaId} showCode className="text-xs" iconClassName="size-4" />
        ) : (
          <span className="opacity-40">—</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 shrink-0">
        <Button
          onClick={(e) => {
            e.stopPropagation()
            handleCompareClick()
          }}
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
      </div>
    </div>
  )
}
