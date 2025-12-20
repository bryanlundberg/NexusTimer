import { Card } from '@/components/ui/card'
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
        'relative grow flex flex-col items-center justify-center w-full h-full text-center transition duration-200 rounded-md cursor-pointer p-3'
      }
    >
      <div className="absolute top-2 right-2 text-[10px] opacity-60">#{index + 1}</div>

      <div className="flex items-end gap-1">
        <span className="text-2xl font-semibold">{formatTime(orderedSolves[index].time).split('.')[0]}</span>
        <span className="text-base opacity-80">.{formatTime(orderedSolves[index].time).split('.')[1]}</span>
        {orderedSolves[index].plus2 ? (
          <span className="ms-2 text-lg font-black text-red-600" data-testid={`plus-two-icon-${index}`}>
            +2
          </span>
        ) : null}
        {orderedSolves[index].dnf ? (
          <span className="ms-1 text-md font-black text-red-600" data-testid={`dnf-icon-${index}`}>
            DNF
          </span>
        ) : null}
      </div>

      <div className="mt-2 text-xs opacity-80">
        {DateTime.fromMillis(orderedSolves[index].endTime || 0)
          .setLocale(locale)
          .toFormat('MMM dd, yyyy')}
      </div>

      <div className="absolute left-2 bottom-2 flex items-center gap-2 text-xs">
        {orderedSolves[index].comment && (
          <span className="flex items-center gap-1 opacity-80" data-testid={`comment-icon-${index}`}>
            <ChatBubbleIcon />
          </span>
        )}
      </div>

      {orderedSolves[index].bookmark && (
        <div className="absolute left-2 top-2 text-yellow-500">
          <BookmarkFilledIcon className={'size-5'} data-testid={`bookmark-icon-${index}`} />
        </div>
      )}
    </Button>
  )
}
