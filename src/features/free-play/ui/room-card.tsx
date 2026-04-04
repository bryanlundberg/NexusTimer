import { Clock, Timer, Users, ArrowRight, Lock } from 'lucide-react'
import formatTime from '@/shared/lib/formatTime'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useCountdown } from '@/shared/model/useCountdown'
import { useLocale, useTranslations } from 'next-intl'
import moment from 'moment'

interface RoomCardProps {
  room: {
    roomId: string
    name: string
    event: string
    maxRoundTime: number
    createdAt: string
    currentRoundTimeLimit?: number
    presence?: Record<string, any>
    passwordHash?: string
  }
  onJoinPrivate?: () => void
}

export default function RoomCard({ room, onJoinPrivate }: RoomCardProps) {
  const t = useTranslations('Multiplayer.room-card')
  const tMultiplayer = useTranslations('Multiplayer')
  const { mmss, isFinished } = useCountdown(room.currentRoundTimeLimit)
  const usersPresence = room?.presence ? Object.values(room.presence) : []
  const locale = useLocale()
  const isPrivate = Boolean(room.passwordHash)

  const cardContent = (
    <div className="rounded-xl border border-border p-4 transition-colors duration-200 hover:border-foreground/20 h-full flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {isPrivate && <Lock className="size-3 text-muted-foreground shrink-0" />}
          <h3 className="text-sm font-semibold truncate">{room.name}</h3>
        </div>
        <span className="flex-shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {room.event}
        </span>
      </div>

      {/* Users & timer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {usersPresence.length > 0 ? (
              usersPresence.slice(0, 3).map((user: any, index: number) => (
                <Tooltip key={user?.userId || index}>
                  <TooltipTrigger asChild>
                    <Avatar className="size-6 border-2 border-background ring-0">
                      <AvatarImage className="object-cover" src={user?.image} alt={user?.name || 'User'} />
                      <AvatarFallback className="text-[9px] bg-muted">
                        {user?.name?.charAt(0)?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{user?.name || tMultiplayer('anonymous')}</p>
                  </TooltipContent>
                </Tooltip>
              ))
            ) : (
              <div className="size-6 rounded-full bg-muted flex items-center justify-center">
                <Users className="size-3 text-muted-foreground" />
              </div>
            )}
            {usersPresence.length > 3 && (
              <div className="size-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[9px] font-medium text-muted-foreground">
                +{usersPresence.length - 3}
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {usersPresence.length} {t('users-online')}
          </span>
        </div>

        {room.currentRoundTimeLimit && !isFinished && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Timer className="size-3 animate-pulse" />
            <span className="font-mono tabular-nums">{mmss}</span>
          </div>
        )}
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {formatTime(room.maxRoundTime * 1000)}
          </span>
          <span>{moment(room.createdAt).locale(locale).fromNow()}</span>
        </div>
        <ArrowRight className="size-3.5 text-muted-foreground/0 group-hover:text-foreground transition-colors duration-200" />
      </div>
    </div>
  )

  if (isPrivate && onJoinPrivate) {
    return (
      <button className="no-underline group block w-full text-left cursor-pointer" onClick={onJoinPrivate}>
        {cardContent}
      </button>
    )
  }

  return (
    <Link href={`/free-play/${room.roomId}`} className="no-underline group block">
      {cardContent}
    </Link>
  )
}
