import { Solve } from '@/entities/solve/model/types'
import useSolvesGrid from '@/features/solves-grid/model/useSolvesGrid'
import SolveGridItem from '@/features/solves-grid/ui/SolveGridItem'
import EmptyGrid from '@/features/solves-grid/ui/EmptyGrid'
import SolvesSelectionBar from '@/features/solves-grid/ui/SolvesSelectionBar'
import { SolvesSelectionProvider } from '@/features/solves-grid/model/SolvesSelectionContext'
import VirtualizedGrid from '@/shared/ui/VirtualizedGrid'
import { useCallback } from 'react'
import { useIsMobile } from '@/shared/model/use-mobile'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'

interface SolvesGridProps {
  solves: Array<Solve>
}

export default function SolvesGrid({ solves }: SolvesGridProps) {
  const { orderedSolves } = useSolvesGrid(solves)
  const isMobile = useIsMobile()
  const [tabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })

  const renderItem = useCallback(
    (solve: Solve, index: number) => <SolveGridItem index={index} orderedSolves={orderedSolves} solve={solve} />,
    [orderedSolves]
  )

  const getItemKey = useCallback((solve: Solve) => solve.id, [])

  if (!orderedSolves || orderedSolves.length === 0) return <EmptyGrid />

  return (
    <SolvesSelectionProvider key={tabMode}>
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
        <SolvesSelectionBar />
      </div>
    </SolvesSelectionProvider>
  )
}
