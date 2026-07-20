import { Solve } from '@/entities/solve/model/types'
import formatTime from '@/shared/lib/formatTime'
import { useLocale } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { Check, Star } from 'lucide-react'
import useSolveGridItem from '@/features/solves-grid/model/useSolveGridItem'
import { useSolvesSelection } from '@/features/solves-grid/model/SolvesSelectionContext'
import { useLongPress } from '@/features/solves-grid/model/useLongPress'
import { Button } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'

interface SolveGridItemProps {
  index: number
  orderedSolves: Array<Solve>
  solve: Solve
}

export default function SolveGridItem({ index, orderedSolves, solve }: SolveGridItemProps) {
  const locale = useLocale()
  const { handleOpenSolveDetails } = useSolveGridItem(solve)
  const { selectionMode, isSelected, enterSelection, toggle } = useSolvesSelection()
  const selected = isSelected(solve.id)

  const { isSuppressed, handlers } = useLongPress({ onLongPress: () => enterSelection(solve.id) })

  const handleClick = () => {
    // Ignore the synthetic click that follows a long press (item is already selected).
    if (isSuppressed()) return
    if (selectionMode) {
      toggle(solve.id)
      return
    }
    handleOpenSolveDetails()
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    // On touch, a long press also fires a native contextmenu — skip it so the
    // pressed item stays selected instead of being toggled back off.
    if (isSuppressed()) return
    if (selectionMode) toggle(solve.id)
    else enterSelection(solve.id)
  }

  return (
    <Button
      variant={'outline'}
      data-testid={`solve-grid-item-${index}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      {...handlers}
      aria-pressed={selectionMode ? selected : undefined}
      style={{ WebkitTouchCallout: 'none' }}
      className={cn(
        'relative grow flex flex-col items-center justify-center w-full h-full text-center transition duration-200 rounded-md cursor-pointer p-2 sm:p-3 select-none active:translate-y-0 active:scale-100 hover:ring-2 hover:ring-primary',
        selected && 'ring-2 ring-primary bg-primary/10'
      )}
    >
      {orderedSolves[index].bookmark && (
        <div
          className="pointer-events-none absolute left-0 top-0 size-5 overflow-hidden rounded-tl-md"
          data-testid={`bookmark-icon-${index}`}
        >
          <div className="absolute left-0 top-0 size-0 border-r-[20px] border-t-[20px] border-r-transparent border-t-yellow-500" />
          <Star className="absolute left-[2px] top-[2px] size-2 fill-white text-white" />
        </div>
      )}

      {selectionMode ? (
        <div
          className={cn(
            'absolute top-1 right-1 sm:top-2 sm:right-2 flex size-4 items-center justify-center rounded-full border transition-colors',
            selected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
          )}
          data-testid={`solve-select-indicator-${index}`}
        >
          {selected && <Check className="size-3" />}
        </div>
      ) : (
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-[10px] text-muted-foreground">#{index + 1}</div>
      )}

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
        {dayjs(orderedSolves[index].endTime || 0)
          .locale(locale)
          .format('MMM DD, YYYY')}
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
