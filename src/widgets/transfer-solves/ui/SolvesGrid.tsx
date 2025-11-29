import { Button } from '@/components/ui/button'
import { VirtualizedGrid } from '@mierak/react-virtualized-grid'
import { useTranslations } from 'next-intl'
import { Solve } from '@/entities/solve/model/types'
import EmptySolves from '@/widgets/transfer-solves/ui/EmptySolves'
import { useTransferSolvesStore } from '@/widgets/transfer-solves/model/useTransferSolvesStore'
import SolveTransferCard from '@/widgets/transfer-solves/ui/SolveTransferCard'

interface SolvesGridProps {
  selectedSolves: string[]
  displaySolves: Solve[]
  handleToggleAll: (type: 'select' | 'deselect') => void
}

export default function SolvesGrid({ selectedSolves, displaySolves, handleToggleAll }: SolvesGridProps) {
  const t = useTranslations('Index.TransferSolvesPage')
  const toggleSolveSelection = useTransferSolvesStore((s) => s.toggleSolveSelection)

  if (displaySolves.length === 0) return <EmptySolves />

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
        itemCount={displaySolves.length}
        rowHeight={80}
        cellWidth={140}
        gridGap={10}
        className="pb-52 ps-1 pe-1 pt-1 container"
      >
        {(index) => (
          <SolveTransferCard
            key={displaySolves[index].id}
            solve={displaySolves[index]}
            isSelected={selectedSolves.includes(displaySolves[index].id)}
            onToggle={() => toggleSolveSelection(displaySolves[index].id)}
          />
        )}
      </VirtualizedGrid>
    </>
  )
}
