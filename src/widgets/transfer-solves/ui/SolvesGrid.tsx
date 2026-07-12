import { useTranslations } from 'next-intl'
import { Solve } from '@/entities/solve/model/types'
import { useTransferSolvesStore } from '@/widgets/transfer-solves/model/useTransferSolvesStore'
import SolveTransferCard from '@/widgets/transfer-solves/ui/SolveTransferCard'
import EmptyGrid from '@/features/solves-grid/ui/EmptyGrid'
import VirtualizedGrid from '@/shared/ui/VirtualizedGrid'
import { useCallback } from 'react'
import { cn } from '@/shared/lib/utils'
import { useIsMobile } from '@/shared/model/use-mobile'

interface SolvesGridProps {
  selectedSolves: string[]
  displaySolves: Solve[]
  hasSource?: boolean
}

export default function SolvesGrid({ selectedSolves, displaySolves, hasSource = true }: SolvesGridProps) {
  const t = useTranslations('Index.TransferSolvesPage')
  const toggleSolveSelection = useTransferSolvesStore((s) => s.toggleSolveSelection)
  const isMobile = useIsMobile()

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

  if (displaySolves.length === 0) {
    if (!hasSource) {
      return <EmptyGrid title={t('no-source-title')} description={t('no-source-description')} nexiState="hello" />
    }
    return <EmptyGrid title={t('no-solves')} description={t('empty-vault')} />
  }

  return (
    <>
      <div className="flex-1 min-h-0">
        <VirtualizedGrid
          items={displaySolves}
          cellWidth={isMobile ? 110 : 160}
          cellHeight={isMobile ? 92 : 120}
          gridGap={8}
          className={cn('px-3 pt-2 pb-3')}
          renderItem={renderItem}
          getItemKey={getItemKey}
        />
      </div>
    </>
  )
}
