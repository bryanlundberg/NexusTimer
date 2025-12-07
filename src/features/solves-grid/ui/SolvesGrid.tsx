import { Solve } from '@/entities/solve/model/types'
import { VirtualizedGrid } from '@mierak/react-virtualized-grid'
import useSolvesGrid from '@/features/solves-grid/model/useSolvesGrid'
import SolveGridItem from '@/features/solves-grid/ui/SolveGridItem'
import EmptyGrid from '@/features/solves-grid/ui/EmptyGrid'

interface SolvesGridProps {
  solves: Array<Solve>
}

export default function SolvesGrid({ solves }: SolvesGridProps) {
  const { orderedSolves } = useSolvesGrid(solves)

  if (!orderedSolves || orderedSolves.length === 0) return <EmptyGrid />

  return (
    <div className="flex-1 min-h-0">
      <div className="px-2">
        <VirtualizedGrid
          itemCount={orderedSolves.length}
          rowHeight={160}
          cellWidth={220}
          gridGap={8}
          className="h-full pb-56"
        >
          {(index) => <SolveGridItem index={index} orderedSolves={orderedSolves} solve={orderedSolves[index]} />}
        </VirtualizedGrid>
      </div>
    </div>
  )
}
