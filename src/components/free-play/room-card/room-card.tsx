import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Box, Clock, Timer, Users } from 'lucide-react'
import { format } from 'date-fns'
import formatTime from '@/lib/formatTime'
import Link from 'next/link'
import { useCountdown } from '@/hooks/useCountdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

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
  const { mmss, isFinished } = useCountdown(room.currentRoundTimeLimit)
  const usersPresence = room?.presence ? Object.values(room.presence) : []

  return (
    <Link href={`/free-play/${room.roomId}`} className="no-underline">
      <Card className="hover:shadow-lg transition-shadow duration-300 hover:border-primary cursor-pointer h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold truncate">{room.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-nowrap">Users online:</span>
            <div className="flex items-center gap-1 flex-wrap">
              {usersPresence.length > 0 ? (
                usersPresence.map((user: any, index: number) => (
                  <Tooltip key={user?.userId || index}>
                    <TooltipTrigger asChild>
                      <div>
                        <Avatar className="h-6 w-6 border border-border">
                          <AvatarImage className={'object-cover'} src={user?.image} alt={user?.name || 'User'} />
                          <AvatarFallback className="text-xs">
                            {user?.name?.charAt(0)?.toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{user?.name || 'Anonymous'}</p>
                    </TooltipContent>
                  </Tooltip>
                ))
              ) : (
                <span className="font-semibold text-muted-foreground">0</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Box className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Event:</span>
            <span className="font-semibold">{room.event}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Max Time per Round:</span>
            <span className="font-semibold">{formatTime(room.maxRoundTime * 1000)}</span>
          </div>

          {room.currentRoundTimeLimit && !isFinished && (
            <div className="flex items-center gap-2 text-sm">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Next round starts in:</span>
              <span className="font-semibold font-mono">{mmss}</span>
            </div>
          )}

          <div className="pt-2 border-t">
            <span className="text-xs text-muted-foreground">{format(new Date(room.createdAt), 'PPpp')}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
