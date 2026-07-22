import formatTime from '@/shared/lib/formatTime'
import { Solve } from '@/entities/solve/model/types'
import { Button } from '@/components/ui/button'
import { useLocale } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface SolveTransferCardProps {
  solve: Solve
  isSelected: boolean
  onToggle: () => void
}

export default function SolveTransferCard({ solve, isSelected, onToggle }: SolveTransferCardProps) {
  const locale = useLocale()
  return (
    <Button
      variant={'outline'}
      notch={false}
      id={solve.id}
      data-testid={`solve-card-${solve.id}`}
      onClick={onToggle}
      aria-pressed={isSelected}
      data-selected={isSelected ? 'true' : undefined}
      className={cn(
        'solve-notch relative grow flex items-center justify-center font-medium text-center transition duration-200 cursor-pointer w-full h-full p-2 sm:p-3 select-none active:translate-y-0 active:scale-100'
      )}
    >
      <div className="flex items-end gap-1 tabular-nums">
        <span className="text-base sm:text-2xl font-semibold">{formatTime(solve.time).split('.')[0]}</span>
        <span className="text-xs sm:text-base text-muted-foreground">.{formatTime(solve.time).split('.')[1]}</span>
        {solve.plus2 && (
          <span className="ms-1 sm:ms-2 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-600">
            +2
          </span>
        )}
        {solve.dnf && (
          <span className="ms-1 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-600">
            DNF
          </span>
        )}
      </div>
      <div className="absolute z-20 text-[10px] sm:text-xs top-1 left-1 text-muted-foreground">
        {dayjs(solve.startTime).locale(locale).format('L')}
      </div>
      <div
        className={cn(
          'absolute top-1 right-1 sm:top-2 sm:right-2 flex size-4 items-center justify-center rounded-[3px] border transition-colors',
          isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
        )}
        data-testid={`solve-select-indicator-${solve.id}`}
      >
        {isSelected && <Check className="size-3" />}
      </div>
    </Button>
  )
}
