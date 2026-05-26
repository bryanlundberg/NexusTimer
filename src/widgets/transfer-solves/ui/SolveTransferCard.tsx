import formatTime from '@/shared/lib/formatTime'
import { Solve } from '@/entities/solve/model/types'
import { Button } from '@/components/ui/button'
import { useLocale } from 'next-intl'
import moment from 'moment'

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
      id={solve.id}
      data-testid={`solve-card-${solve.id}`}
      onClick={onToggle}
      className={`relative grow flex items-center justify-center font-medium text-center transition duration-200 rounded-md cursor-pointer w-full h-full bg-secondary text-secondary-foreground hover:scale-[1.02] active:scale-[0.98] ${isSelected ? 'ring-3 ring-primary' : ''}`}
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
        {moment(solve.startTime).locale(locale).format('L')}
      </div>
    </Button>
  )
}
