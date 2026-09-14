import { Solve } from '@/entities/solve/model/types'
import useSolvesGrid from '@/features/solves-grid/model/useSolvesGrid'
import SolveGridItem from '@/features/solves-grid/ui/SolveGridItem'
import EmptyGrid from '@/features/solves-grid/ui/EmptyGrid'
import SolvesSelectionBar from '@/features/solves-grid/ui/SolvesSelectionBar'
import { SolvesSelectionProvider } from '@/features/solves-grid/model/SolvesSelectionContext'
import VirtualizedGrid from '@/shared/ui/VirtualizedGrid'
import { useCallback, useMemo } from 'react'
import { useIsMobile } from '@/shared/model/use-mobile'
import { useQueryState } from 'nuqs'
import { useTranslations } from 'next-intl'
import { STATES } from '@/shared/const/states'
import formatTime from '@/shared/lib/formatTime'

interface SolvesGridProps {
  solves: Array<Solve>
}

export default function SolvesGrid({ solves }: SolvesGridProps) {
  const { orderedSolves } = useSolvesGrid(solves)
  const isMobile = useIsMobile()
  const t = useTranslations('Index')
  const [tabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })

  const summary = useMemo(() => {
    let best: number | null = null
    let total = 0
    let valid = 0
    for (const solve of orderedSolves ?? []) {
      if (solve.dnf) continue
      valid++
      total += solve.time
      if (best === null || solve.time < best) best = solve.time
    }
    return { count: orderedSolves?.length ?? 0, best, mean: valid > 0 ? total / valid : null }
  }, [orderedSolves])

  const recordTime = summary.count > 1 ? summary.best : null

  const renderItem = useCallback(
    (solve: Solve, index: number) => (
      <SolveGridItem
        index={index}
        orderedSolves={orderedSolves}
        solve={solve}
        isRecord={!solve.dnf && solve.time === recordTime}
      />
    ),
    [orderedSolves, recordTime]
  )

  const getItemKey = useCallback((solve: Solve) => solve.id, [])

  const allIds = useMemo(() => (orderedSolves ?? []).map((solve) => solve.id), [orderedSolves])

  if (!orderedSolves || orderedSolves.length === 0) return <EmptyGrid />

  return (
    <SolvesSelectionProvider key={tabMode}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 pb-2 text-xs text-muted-foreground">
        <span>{t('SolvesRail.solves', { count: summary.count })}</span>
        {summary.best !== null && (
          <>
            <span className="text-muted-foreground/50">·</span>
            <span>
              {t('HomePage.best')}{' '}
              <span className="font-semibold tabular-nums text-amber-700 dark:text-amber-400">
                {formatTime(summary.best)}
              </span>
            </span>
          </>
        )}
        {summary.mean !== null && (
          <>
            <span className="text-muted-foreground/50">·</span>
            <span>
              {t('HomePage.average')}{' '}
              <span className="font-semibold tabular-nums text-foreground">{formatTime(summary.mean)}</span>
            </span>
          </>
        )}
      </div>
      <div className="flex-1 min-h-0 relative">
        <VirtualizedGrid
          items={orderedSolves}
          cellWidth={isMobile ? 110 : 160}
          cellHeight={isMobile ? 92 : 120}
          gridGap={8}
          className="px-3 pb-4 pt-1"
          renderItem={renderItem}
          getItemKey={getItemKey}
        />
        <SolvesSelectionBar allIds={allIds} />
      </div>
    </SolvesSelectionProvider>
  )
}
