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
      className={`relative grow flex items-center justify-center font-medium text-center transition duration-200 rounded-md cursor-pointer w-full h-full bg-secondary text-secondary-foreground ${isSelected ? 'ring-3 ring-primary' : ''}`}
    >
      <div className="flex items-end gap-1">
        <span className="text-base sm:text-2xl font-semibold">{formatTime(solve.time).split('.')[0]}</span>
        <span className="text-xs sm:text-base opacity-80">.{formatTime(solve.time).split('.')[1]}</span>
        {solve.plus2 && <span className="ms-1 sm:ms-2 text-sm sm:text-lg font-black text-red-600">+2</span>}
        {solve.dnf && <span className="ms-1 text-xs sm:text-md font-black text-red-600">DNF</span>}
      </div>
      <div className="absolute z-20 text-[10px] sm:text-xs top-1 left-1 opacity-80">
        {moment(solve.startTime).locale(locale).format('L')}
      </div>
    </Button>
  )
}
