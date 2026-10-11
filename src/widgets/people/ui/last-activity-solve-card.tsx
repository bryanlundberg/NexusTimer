import { CubeCategoryTile } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import dayjs from '@/shared/lib/dayjs'
import formatTime from '@/shared/lib/formatTime'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import ScrambleDisplay from '@/shared/ui/scramble-display/ui/ScrambleDisplay'
import { CubeCategory } from '@/shared/const/cube-categories'
import { useLocale } from 'next-intl'

interface LastActivitySolveCardProps {
  solve: {
    id: string
    time: number
    startTime: number
    endTime: number
    scramble: string
    dnf?: boolean
    plus2?: boolean
    category: CubeCategory
    cubeName: string
  }
  index: number
}

export function LastActivitySolveCard({ solve, index }: LastActivitySolveCardProps) {
  const locale = useLocale()

  return (
    <div className="item-card group flex flex-col">
      <div className="p-4 pb-3">
        {/* Header: cube + meta */}
        <div className="flex items-center gap-3 mb-3">
          <CubeCategoryTile category={solve.category} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold tracking-tight truncate">{solve.cubeName}</div>
            <div className="text-[10px] text-muted-foreground">
              {dayjs(solve.startTime).locale(locale).format('LLL')}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <CategoryBadge category={solve.category} />
            <span className="text-[10px] font-mono text-muted-foreground/50">#{index}</span>
          </div>
        </div>

        {/* Time + Scramble visual side by side */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black font-mono tracking-tighter tabular-nums">
                {formatTime(solve.time)}
              </span>
              {solve.dnf && <span className="text-xs font-bold text-destructive">DNF</span>}
              {solve.plus2 && <span className="text-xs font-bold text-warning">+2</span>}
            </div>
          </div>

          <div className="relative size-16 shrink-0 border border-border/40 bg-muted/30 flex items-center justify-center overflow-hidden">
            <ScrambleDisplay className="size-full p-0.5" show scramble={solve.scramble} event={solve.category} />
          </div>
        </div>
      </div>

      {/* Scramble text — collapsible feel */}
      <div className="px-5 pb-3">
        <div className="text-[11px] font-mono leading-relaxed break-all text-muted-foreground/70 line-clamp-2 group-hover:text-muted-foreground transition-colors">
          {solve.scramble}
        </div>
      </div>
    </div>
  )
}
