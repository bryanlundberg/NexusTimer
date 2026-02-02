import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Box, Clock, Timer, Users } from 'lucide-react'
import { format } from 'date-fns'
import formatTime from '@/shared/lib/formatTime'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useCountdown } from '@/shared/model/useCountdown'
import { useTranslations } from 'next-intl'

interface RoomCardProps {
  room: {
    roomId: string
    name: string
    event: string
    maxRoundTime: number
    createdAt: string
    currentRoundTimeLimit?: number
    presence?: Record<string, any>
  }
}

export default function RoomCard({ room }: RoomCardProps) {
  const t = useTranslations('Multiplayer.room-card')
  const tMultiplayer = useTranslations('Multiplayer')
  const { mmss, isFinished } = useCountdown(room.currentRoundTimeLimit)
  const usersPresence = room?.presence ? Object.values(room.presence) : []

  return (
    <Link href={`/free-play/${room.roomId}`} className="no-underline group">
      <Card className="overflow-hidden transition-all duration-300 border-muted/60 group-hover:border-primary/50 group-hover:shadow-md h-full flex flex-col">
        <div className="h-1.5 w-full bg-primary/10 group-hover:bg-primary/30 transition-colors" />
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-xl font-bold truncate group-hover:text-primary transition-colors">
              {room.name}
            </CardTitle>
            <div className="bg-secondary/50 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {room.event}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {usersPresence.length > 0 ? (
                  usersPresence.slice(0, 4).map((user: any, index: number) => (
                    <Tooltip key={user?.userId || index}>
                      <TooltipTrigger asChild>
                        <Avatar className="h-7 w-7 border-2 border-background ring-0">
                          <AvatarImage className="object-cover" src={user?.image} alt={user?.name || 'User'} />
                          <AvatarFallback className="text-[10px] bg-muted">
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
                  <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                    <Users className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
                {usersPresence.length > 4 && (
                  <div className="h-7 w-7 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] font-medium">
                    +{usersPresence.length - 4}
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground font-medium ml-1">
                {usersPresence.length} {t('users-online')}
              </span>
            </div>

            {room.currentRoundTimeLimit && !isFinished && (
              <div className="flex items-center gap-1.5 bg-primary/5 px-2 py-1 rounded-full border border-primary/10">
                <Timer className="h-3 w-3 text-primary animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-primary">{mmss}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 py-2 border-y border-muted/40">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Event</span>
              <div className="flex items-center gap-1.5">
                <Box className="h-3.5 w-3.5 text-muted-foreground/70" />
                <span className="text-sm font-medium">{room.event}</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Max Time</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                <span className="text-sm font-medium">{formatTime(room.maxRoundTime * 1000)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-muted-foreground italic">
              Created at {format(new Date(room.createdAt), 'p')}
            </span>
            <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold flex items-center gap-1">
              Join <span className="text-lg">→</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
