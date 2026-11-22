import type { Solve } from '@/entities/solve/model/types'
import formatTime from '@/shared/lib/formatTime'
import { cn } from '@/shared/lib/utils'

const SLOTS = 10
const MIN_HEIGHT = 20

interface CubeRecentSparkProps {
  solves: Solve[]
  bestTime: number | null
  className?: string
}

export function CubeRecentSpark({ solves, bestTime, className }: CubeRecentSparkProps) {
  const recent = solves.slice(0, SLOTS).reverse()
  const times = recent.filter((solve) => !solve.dnf).map((solve) => solve.time)
  const min = Math.min(...times)
  const span = Math.max(...times) - min
  const heightOf = (time: number) => (span > 0 ? MIN_HEIGHT + ((time - min) / span) * (100 - MIN_HEIGHT) : 50)
  const empty = SLOTS - recent.length

  return (
    <div aria-hidden className={cn('flex h-6 items-end gap-[3px]', className)}>
      {Array.from({ length: empty }, (_, index) => (
        <span key={`empty-${index}`} className="h-0.5 w-1.5 bg-muted-foreground/15" />
      ))}
      {recent.map((solve) => (
        <span
          key={solve.id}
          title={solve.dnf ? 'DNF' : formatTime(solve.time)}
          style={{ height: `${solve.dnf ? 100 : heightOf(solve.time)}%` }}
          className={cn(
            'w-1.5',
            solve.dnf ? 'bg-destructive/40' : solve.time === bestTime ? 'bg-foreground/80' : 'bg-muted-foreground/40'
          )}
        />
      ))}
    </div>
  )
}
