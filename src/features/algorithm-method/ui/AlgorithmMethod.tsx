import { memo } from 'react'
import { Link } from '@/shared/config/i18n/navigation'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import { PUZZLE_LABELS } from '@/features/algorithm-method/model/method-filters'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ALGORITHM_SET } from '@/shared/const/algorithms-sets'
import { useTranslations } from 'next-intl'
import MethodThumbnail from '@/features/algorithm-method/ui/MethodThumbnail'

const DIFFICULTY_FILL = ['bg-success', 'bg-warning', 'bg-destructive'] as const

function AlgorithmMethod({ set }: { set: ALGORITHM_SET }) {
  const t = useTranslations('Index.AlgorithmsPage')
  const { slug, title, subtitle, puzzle, difficulty, algorithms } = set

  const difficultyLabel =
    difficulty === 1 ? t('casual-enthusiast') : difficulty === 2 ? t('dedicated-learner') : t('algorithm-master')

  const fill = DIFFICULTY_FILL[difficulty - 1] ?? DIFFICULTY_FILL[0]

  return (
    <Link href={`/algorithms/${slug}`} className="group focus:outline-none">
      <div className="surface flex h-full flex-col gap-5 p-4 text-card-foreground">
        <div className="flex items-start gap-4">
          <MethodThumbnail set={set} />

          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg font-bold leading-tight tracking-tight">{title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <div className="h-px bg-border/70" />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CategoryBadge
                category={PUZZLE_LABELS[puzzle]}
                className="border-transparent bg-foreground/[0.07] px-2 font-semibold uppercase tracking-[0.08em] text-foreground/75"
              />
              <span className="flex items-baseline gap-1">
                <span className="text-sm font-bold tabular-nums">{algorithms.length}</span>
                <span className="text-[11px] text-muted-foreground">{t('algs-unit')}</span>
              </span>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <span role="img" className="flex shrink-0 items-center gap-1" aria-label={difficultyLabel}>
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

export default memo(AlgorithmMethod)
