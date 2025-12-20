import { Card } from '@/components/ui/card'
import formatTime from '@/shared/lib/formatTime'
import { Solve } from '@/entities/solve/model/types'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

interface SolveTransferCardProps {
  solve: Solve
  isSelected: boolean
  onToggle: () => void
}

export default function SolveTransferCard({ solve, isSelected, onToggle }: SolveTransferCardProps) {
  return (
    <Button
      variant={'outline'}
      id={solve.id}
      data-testid={`solve-card-${solve.id}`}
      onClick={onToggle}
      className={`relative grow flex items-center justify-center w-auto font-medium text-center transition duration-200 rounded-md cursor-pointer h-full bg-secondary text-secondary-foreground ${isSelected ? 'ring-3 ring-primary' : ''}`}
    >
      <div className="tracking-wider pt-2">
        <span className="text-md">{formatTime(solve.time).split('.')[0]}</span>
        <span className="text-sm">.{formatTime(solve.time).split('.')[1]}</span>
      </div>
      <div className="absolute z-20 text-xs top-1 left-1">
        {format(new Date(solve.startTime), 'dd/MM/yyyy')}
        {solve.dnf && <span className="text-red-500 font-bold ml-1">DNF</span>}
        {solve.plus2 && <span className="text-yellow-500 font-bold ml-1">+2</span>}
      </div>
    </Button>
  )
}
