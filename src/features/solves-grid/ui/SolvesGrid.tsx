import { Solve } from '@/entities/solve/model/types'
import useSolvesGrid from '@/features/solves-grid/model/useSolvesGrid'
import SolveGridItem from '@/features/solves-grid/ui/SolveGridItem'
import EmptyGrid from '@/features/solves-grid/ui/EmptyGrid'
import VirtualizedGrid from '@/shared/ui/VirtualizedGrid'
import { useCallback } from 'react'

interface SolvesGridProps {
  solves: Array<Solve>
}

export default function SolvesGrid({ solves }: SolvesGridProps) {
  const { orderedSolves } = useSolvesGrid(solves)

  const renderItem = useCallback(
    (solve: Solve, index: number) => <SolveGridItem index={index} orderedSolves={orderedSolves} solve={solve} />,
    [orderedSolves]
  )

  const getItemKey = useCallback((solve: Solve) => solve.id, [])

  if (!orderedSolves || orderedSolves.length === 0) return <EmptyGrid />

  return (
    <div className="flex-1 min-h-0">
      <VirtualizedGrid
        items={orderedSolves}
        cellWidth={160}
        cellHeight={120}
        gridGap={8}
        className="px-2 pb-4 pt-1"
        renderItem={renderItem}
        getItemKey={getItemKey}
      />
    </div>
  )
}
