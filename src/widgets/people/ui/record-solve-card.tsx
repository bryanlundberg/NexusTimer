import formatTime from '@/shared/lib/formatTime'
import ScrambleDisplay from '@/shared/ui/scramble-display/ui/ScrambleDisplay'
import { cn } from '@/shared/lib/utils'
import type { CubeCategory } from '@/shared/const/cube-categories'
import type { RecordSolve } from '@/entities/user-stats/model/types'

interface RecordSolveCardProps {
  solve: RecordSolve
  category: CubeCategory
  label: string
  selected: boolean
  isRecord: boolean
  isTrimmed: boolean
  onSelect: () => void
}

export function RecordSolveCard({
  solve,
  category,
  label,
  selected,
  isRecord,
  isTrimmed,
  onSelect
}: RecordSolveCardProps) {
  const time = formatTime(solve.time)

  return (
    <button
      type="button"
      aria-pressed={selected}
      data-selected={selected}
      data-record={isRecord}
      onClick={onSelect}
      className="surface flex min-w-0 cursor-pointer flex-col items-center gap-1 p-1.5 pb-2 outline-none"
    >
      <span className={cn('text-[10px] font-medium', isRecord ? 'text-record' : 'text-muted-foreground')}>{label}</span>
      <div
        aria-hidden
        className="pointer-events-none flex aspect-[4/3] w-full items-center justify-center overflow-hidden"
      >
        <ScrambleDisplay className="size-full" show scramble={solve.scramble} event={category} />
      </div>
      <span className="flex items-baseline gap-1 text-xs font-bold tabular-nums">
        <span className={cn(isTrimmed && 'text-muted-foreground')}>{isTrimmed ? `(${time})` : time}</span>
        {solve.plus2 && <span className="text-[10px] text-warning">+2</span>}
        {solve.dnf && <span className="text-[10px] text-destructive">DNF</span>}
      </span>
    </button>
  )
}
