import { Solve } from '@/entities/solve/model/types'
import formatTime from '@/shared/lib/formatTime'
import { useLocale } from 'next-intl'
import { DateTime } from 'luxon'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import useSolveGridItem from '@/features/solves-grid/model/useSolveGridItem'
import { Button } from '@/components/ui/button'

interface SolveGridItemProps {
  index: number
  orderedSolves: Array<Solve>
  solve: Solve
}

export default function SolveGridItem({ index, orderedSolves, solve }: SolveGridItemProps) {
  const locale = useLocale()
  const { handleOpenSolveDetails } = useSolveGridItem(solve)
  return (
    <Button
      variant={'outline'}
      data-testid={`solve-grid-item-${index}`}
      onClick={handleOpenSolveDetails}
      className={
        'relative grow flex flex-col items-center justify-center w-full h-full text-center transition duration-200 rounded-md cursor-pointer p-2 sm:p-3 hover:ring-2 hover:ring-primary hover:scale-[1.02] active:scale-[0.98]'
      }
    >
      {orderedSolves[index].bookmark && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-md bg-yellow-500"
          data-testid={`bookmark-icon-${index}`}
        />
      )}

      <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-[10px] text-muted-foreground">#{index + 1}</div>

      <div className="flex items-end gap-1 tabular-nums">
        <span className="text-base sm:text-2xl font-semibold">
          {formatTime(orderedSolves[index].time).split('.')[0]}
        </span>
        <span className="text-xs sm:text-base text-muted-foreground">
          .{formatTime(orderedSolves[index].time).split('.')[1]}
        </span>
        {orderedSolves[index].plus2 ? (
          <span
            className="ms-1 sm:ms-2 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-600"
            data-testid={`plus-two-icon-${index}`}
          >
            +2
          </span>
        ) : null}
        {orderedSolves[index].dnf ? (
          <span
            className="ms-1 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-600"
            data-testid={`dnf-icon-${index}`}
          >
            DNF
          </span>
        ) : null}
      </div>

      <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground">
        {DateTime.fromMillis(orderedSolves[index].endTime || 0)
          .setLocale(locale)
          .toFormat('MMM dd, yyyy')}
      </div>

      <div className="absolute left-1 bottom-1 sm:left-2 sm:bottom-2 flex items-center gap-2 text-xs text-muted-foreground">
        {orderedSolves[index].comment && (
          <span className="flex items-center gap-1" data-testid={`comment-icon-${index}`}>
            <ChatBubbleIcon />
          </span>
        )}
      </div>
    </Button>
  )
}
