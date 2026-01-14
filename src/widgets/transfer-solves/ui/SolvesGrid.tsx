import { useTranslations } from 'next-intl'
import { Solve } from '@/entities/solve/model/types'
import { useTransferSolvesStore } from '@/widgets/transfer-solves/model/useTransferSolvesStore'
import SolveTransferCard from '@/widgets/transfer-solves/ui/SolveTransferCard'
import EmptyGrid from '@/features/solves-grid/ui/EmptyGrid'
import VirtualizedGrid from '@/shared/ui/VirtualizedGrid'
import { useCallback } from 'react'
import { cn } from '@/shared/lib/utils'

interface SolvesGridProps {
  selectedSolves: string[]
  displaySolves: Solve[]
}

export default function SolvesGrid({ selectedSolves, displaySolves }: SolvesGridProps) {
  const t = useTranslations('Index.TransferSolvesPage')
  const toggleSolveSelection = useTransferSolvesStore((s) => s.toggleSolveSelection)

  const renderItem = useCallback(
    (solve: Solve) => (
      <SolveTransferCard
        solve={solve}
        isSelected={selectedSolves.includes(solve.id)}
        onToggle={() => toggleSolveSelection(solve.id)}
      />
    ),
    [selectedSolves]
  )

  const getItemKey = useCallback((solve: Solve) => solve.id, [])

  if (displaySolves.length === 0) return <EmptyGrid title={t('no-solves')} description={t('empty-vault')} />

  return (
    <>
      <div className="flex-1 min-h-0">
        <VirtualizedGrid
          items={displaySolves}
          cellWidth={220}
          cellHeight={160}
          gridGap={10}
          className={cn('px-2 pt-2 pb-3')}
          renderItem={renderItem}
          getItemKey={getItemKey}
        />
      </div>
    </>
  )
}
