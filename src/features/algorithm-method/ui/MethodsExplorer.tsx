'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/shared/lib/utils'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { CubeColorDot } from '@/shared/ui/category-badge/CubeColorDot'
import AlgorithmMethod from '@/features/algorithm-method/ui/AlgorithmMethod'
import {
  PUZZLE_COUNTS,
  PUZZLE_LABELS,
  PUZZLE_ORDER,
  countAlgorithms,
  filterMethods,
  togglePuzzle,
  type MethodPuzzle
} from '@/features/algorithm-method/model/method-filters'

export default function MethodsExplorer() {
  const t = useTranslations('Index.AlgorithmsPage')
  const [selected, setSelected] = useState<MethodPuzzle[]>([])

  const { sets, algorithms } = useMemo(() => {
    const sets = filterMethods(ALGORITHM_SETS, selected)
    return { sets, algorithms: countAlgorithms(sets) }
  }, [selected])

  return (
    <div className="mb-8">
      <div role="group" aria-label={t('filters.puzzle')} className="mb-4 flex flex-wrap items-center gap-1.5">
        {PUZZLE_ORDER.map((puzzle) => {
          const active = selected.includes(puzzle)
          return (
            <Badge
              key={puzzle}
              asChild
              variant={active ? 'default' : 'outline'}
              className={cn(
                'badge-notch cursor-pointer select-none gap-1.5 px-2 py-0.5 text-[10px] transition-colors sm:text-xs',
                // badge-notch clips with clip-path, which would swallow the default
                // focus ring, so draw the focus indicator inside the box instead.
                'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
                active ? 'hover:bg-primary/90' : 'hover:border-primary/40 hover:bg-primary/10'
              )}
            >
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setSelected((current) => togglePuzzle(current, puzzle))}
              >
                <CubeColorDot category={puzzle} />
                {PUZZLE_LABELS[puzzle]}
                <span className="opacity-60 tabular-nums">{PUZZLE_COUNTS[puzzle]}</span>
              </button>
            </Badge>
          )
        })}
      </div>

      <div className="mb-4 flex items-center gap-3">
        <p aria-live="polite" className="text-xs text-muted-foreground">
          {t('filters.results', { sets: sets.length, algorithms })}
        </p>
        {selected.length > 0 && (
          <button type="button" onClick={() => setSelected([])} className="text-xs text-primary hover:underline">
            {t('filters.clear')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {sets.map((set) => (
          <AlgorithmMethod key={set.slug} set={set} />
        ))}
      </div>
    </div>
  )
}
