import { TableCell, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GlobeAmericasIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import ScrambleDisplay from '@/shared/ui/scramble-display/ui/ScrambleDisplay'
import formatTime from '@/shared/lib/formatTime'
import calcTurnsPerSecond from '@/lib/calcTurnsPerSecond'
import { format } from 'date-fns'
import useLeaderboardRow from '@/features/leaderboards-table/model/useLeaderboardRow'
import { SolveServer } from '@/entities/solve/model/types'

interface LeaderboardTableRowProps {
  solve: SolveServer
  index: number
}

export default function LeaderboardTableRow({ solve, index }: LeaderboardTableRowProps) {
  const router = useRouter()
  const { openModal } = useLeaderboardRow(solve)

  return (
    <TableRow key={solve._id} onClick={openModal}>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell className="font-medium overflow-hidden max-w-20 sm:max-w-32 md:max-w-40 lg:max-w-96 whitespace-normal">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={'flex flex-row items-center justify-center gap-2 hover:underline'}
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/people/${solve.user._id}`)
              }}
            >
              <Avatar>
                <AvatarImage className={'object-cover'} src={solve.user.image} />
                <AvatarFallback>{solve.user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              {solve.user.name}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <h2 className="scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance flex items-center justify-center gap-2">
              {solve.user.name}{' '}
              {solve.user?.pronoun && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground font-normal">
                  <span>{solve.user?.pronoun}</span>
                </div>
              )}
            </h2>

            {solve.user?.timezone && (
              <div className={'flex items-center gap-1'}>
                <GlobeAmericasIcon className={'size-5'} />
                {solve.user?.timezone}
                <span className={'opacity-50'}>
                  (
                  {new Intl.DateTimeFormat('en-US', {
                    timeZone: solve.user.timezone,
                    timeStyle: 'short'
                  }).format(new Date())}
                  )
                </span>
              </div>
            )}
            {solve.user?.goal && <Badge>{solve.user?.goal}</Badge>}
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell className="font-medium hidden sm:table-cell">{solve.puzzle}</TableCell>
      <TableCell className="font-medium hidden md:table-cell overflow-hidden max-w-20 sm:max-w-32 md:max-w-40 lg:max-w-96 whitespace-normal">
        {solve.solution ? `${calcTurnsPerSecond(solve.solution, solve.time)} tps` : 'N/A'}
      </TableCell>
      <TableCell>{formatTime(solve.time)}</TableCell>
      <TableCell className="hidden sm:table-cell text-right">
        <ScrambleDisplay className={'size-20'} show scramble={solve.scramble} event={solve.puzzle} />
      </TableCell>
      <TableCell className="font-medium hidden sm:table-cell">
        {format(new Date(solve.createdAt), 'd MMM yyyy')}
      </TableCell>
    </TableRow>
  )
}
