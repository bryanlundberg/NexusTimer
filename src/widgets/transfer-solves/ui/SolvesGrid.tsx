import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { Solve } from '@/entities/solve/model/types'
import { useTransferSolvesStore } from '@/widgets/transfer-solves/model/useTransferSolvesStore'
import SolveTransferCard from '@/widgets/transfer-solves/ui/SolveTransferCard'
import EmptyGrid from '@/features/solves-grid/ui/EmptyGrid'
import VirtualizedGrid from '@/shared/ui/VirtualizedGrid'
import { useCallback } from 'react'

interface SolvesGridProps {
  selectedSolves: string[]
  displaySolves: Solve[]
  handleToggleAll: (type: 'select' | 'deselect') => void
}

export default function SolvesGrid({ selectedSolves, displaySolves, handleToggleAll }: SolvesGridProps) {
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
      <div className={'flex justify-between items-center mt-2 mb-4'}>
        <div data-testid="solves-selected-counter">{t('solves-selected', { count: selectedSolves.length })}</div>
        <div className={'flex gap-2'}>
          <Button
            data-testid="select-all-button"
            variant={selectedSolves.length === displaySolves.length ? 'default' : 'outline'}
            onClick={() => handleToggleAll('select')}
          >
            {t('select-all')}
          </Button>
          <Button variant={'outline'} onClick={() => handleToggleAll('deselect')} data-testid="deselect-all-button">
            {t('deselect-all')}
          </Button>
        </div>
      </div>

      <VirtualizedGrid
        items={displaySolves}
        cellWidth={220}
        cellHeight={160}
        gridGap={10}
        className="pb-4 ps-1 pe-1 pt-1 container"
        renderItem={renderItem}
        getItemKey={getItemKey}
      />
    </>
  )
}
