import Link from 'next/link'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ALGORITHM_SET } from '@/shared/const/algorithms-sets'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import MethodThumbnail from '@/features/algorithm-method/ui/MethodThumbnail'

const DIFFICULTY_FILL = ['bg-emerald-500', 'bg-amber-500', 'bg-red-500'] as const

export default function AlgorithmMethod({ set }: { set: ALGORITHM_SET }) {
  const t = useTranslations('Index.AlgorithmsPage')
  const { slug, title, subtitle, puzzle, difficulty, algorithms } = set

  const difficultyLabel =
    difficulty === 1 ? t('casual-enthusiast') : difficulty === 2 ? t('dedicated-learner') : t('algorithm-master')

  const fill = DIFFICULTY_FILL[difficulty - 1] ?? DIFFICULTY_FILL[0]

  return (
    <Link href={`/algorithms/${slug}`} className="group focus:outline-none rounded-none">
      <div className="algo-card-notch [--ac-notch:16px] flex h-full flex-col gap-5 p-5 text-card-foreground">
        <div className="flex items-start gap-4">
          <MethodThumbnail set={set} />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-lg font-bold leading-tight tracking-tight">{title}</h3>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary" />
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <div className="h-px bg-border/70" />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CategoryBadge
                category={puzzle}
                className="border-transparent bg-foreground/[0.07] px-2 font-semibold uppercase tracking-[0.08em] text-foreground/75"
              />
              <span className="flex items-baseline gap-1">
                <span className="text-sm font-bold tabular-nums">{algorithms.length}</span>
                <span className="text-[11px] text-muted-foreground">algs</span>
              </span>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex shrink-0 items-center gap-1" aria-label={difficultyLabel}>
                  {[1, 2, 3].map((level) => (
                    <span
                      key={level}
                      className={`diag-bar h-1.5 w-4 transition-colors ${level <= difficulty ? fill : 'bg-muted'}`}
                    />
                  ))}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                {difficultyLabel}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </Link>
  )
}
