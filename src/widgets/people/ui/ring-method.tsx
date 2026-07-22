import { cn } from '@/shared/lib/utils'
import type { LearnedMethodView } from '@/entities/trainer-learned/lib/buildLearnedMethods'

const SIZE = 72
const STROKE = 8
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function RingMethod({
  view,
  selected,
  onSelect,
  strokeClass = 'stroke-emerald-500'
}: {
  view: LearnedMethodView
  selected: boolean
  onSelect: () => void
  strokeClass?: string
}) {
  const { set, learnedCount, total, percent } = view
  const offset = CIRCUMFERENCE * (1 - percent / 100)

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      data-selected={selected ? 'true' : undefined}
      title={`${set.title} — ${set.subtitle} · ${learnedCount}/${total}`}
      className={cn('category-notch flex w-26 flex-col items-center my-2 gap-2 p-3 focus:outline-none')}
    >
      <div className="relative">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" strokeWidth={STROKE} className="stroke-muted" />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className={strokeClass}
          />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <span className="text-lg font-bold tabular-nums">{learnedCount}</span>
          <span className="text-[10px] tabular-nums text-muted-foreground">/{total}</span>
        </span>
      </div>
      <span className="max-w-full truncate text-xs font-semibold">{set.title}</span>
    </button>
  )
}
