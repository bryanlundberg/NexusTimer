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
      <div className="tracking-wider pt-2">
        <span className="text-md">{formatTime(solve.time).split('.')[0]}</span>
        <span className="text-sm">.{formatTime(solve.time).split('.')[1]}</span>
      </div>
      <div className="absolute z-20 text-xs top-1 left-1">
        {moment(solve.startTime).locale(locale).format('L')}
        {solve.dnf && <span className="text-red-500 font-bold ml-1">DNF</span>}
        {solve.plus2 && <span className="text-yellow-500 font-bold ml-1">+2</span>}
      </div>
    </Button>
  )
}
