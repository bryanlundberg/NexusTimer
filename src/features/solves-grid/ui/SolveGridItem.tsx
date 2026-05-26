import { Solve } from '@/entities/solve/model/types'
import formatTime from '@/shared/lib/formatTime'
import { useLocale } from 'next-intl'
import { DateTime } from 'luxon'
import { BookmarkFilledIcon, ChatBubbleIcon } from '@radix-ui/react-icons'
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
        'relative grow flex flex-col items-center justify-center w-full h-full text-center transition duration-200 rounded-md cursor-pointer p-2 sm:p-3 hover:ring-2 hover:ring-primary'
      }
    >
      <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-[10px] opacity-60">#{index + 1}</div>

      <div className="flex items-end gap-1">
        <span className="text-base sm:text-2xl font-semibold">
          {formatTime(orderedSolves[index].time).split('.')[0]}
        </span>
        <span className="text-xs sm:text-base opacity-80">.{formatTime(orderedSolves[index].time).split('.')[1]}</span>
        {orderedSolves[index].plus2 ? (
          <span
            className="ms-1 sm:ms-2 text-sm sm:text-lg font-black text-red-600"
            data-testid={`plus-two-icon-${index}`}
          >
            +2
          </span>
        ) : null}
        {orderedSolves[index].dnf ? (
          <span className="ms-1 text-xs sm:text-md font-black text-red-600" data-testid={`dnf-icon-${index}`}>
            DNF
          </span>
        ) : null}
      </div>

      <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs opacity-80">
        {DateTime.fromMillis(orderedSolves[index].endTime || 0)
          .setLocale(locale)
          .toFormat('MMM dd, yyyy')}
      </div>

      <div className="absolute left-1 bottom-1 sm:left-2 sm:bottom-2 flex items-center gap-2 text-xs">
        {orderedSolves[index].comment && (
          <span className="flex items-center gap-1 opacity-80" data-testid={`comment-icon-${index}`}>
            <ChatBubbleIcon />
          </span>
        )}
      </div>

      {orderedSolves[index].bookmark && (
        <div className="absolute left-1 top-1 sm:left-2 sm:top-2 text-yellow-500">
          <BookmarkFilledIcon className={'size-4 sm:size-5'} data-testid={`bookmark-icon-${index}`} />
        </div>
      )}
    </Button>
  )
}
