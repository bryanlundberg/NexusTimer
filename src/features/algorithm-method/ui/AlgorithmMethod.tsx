import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import { ALGORITHM_SET } from '@/shared/const/algorithms-sets'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import MethodThumbnail from '@/features/algorithm-method/ui/MethodThumbnail'

export default function AlgorithmMethod({ set }: { set: ALGORITHM_SET }) {
  const t = useTranslations('Index.AlgorithmsPage')
  const { slug, title, subtitle, puzzle, difficulty, algorithms } = set

  const difficultyLabel =
    difficulty === 1 ? t('casual-enthusiast') : difficulty === 2 ? t('dedicated-learner') : t('algorithm-master')

  const difficultyColor =
    difficulty === 1
      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
      : difficulty === 2
        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
        : 'bg-red-500/15 text-red-600 dark:text-red-400'

  return (
    <Link href={`/algorithms/${slug}`} className="group focus:outline-none rounded-none">
      <div className="algo-card-notch flex h-full flex-col gap-3 p-4 text-card-foreground">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <MethodThumbnail set={set} />
            <div>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="text-xs mt-0.5 text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary" />
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CategoryBadge category={puzzle} className="badge-notch text-[11px] font-medium" />
            <span className="text-xs text-muted-foreground">{algorithms.length} algs</span>
          </div>
          <Badge variant="secondary" className={`badge-notch text-[11px] font-medium border-0 ${difficultyColor}`}>
            {difficultyLabel}
          </Badge>
        </div>

        {/* Difficulty bars */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={`diag-bar h-2 flex-1 transition-colors ${
                level <= difficulty
                  ? difficulty === 1
                    ? 'bg-emerald-500'
                    : difficulty === 2
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </Link>
  )
}
