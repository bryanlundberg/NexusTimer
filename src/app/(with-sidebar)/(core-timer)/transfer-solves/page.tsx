'use client'
import { useEffect } from 'react'
import TransferSolvesHeader from '@/widgets/navigation-header/ui/TransferSolvesHeader'
import SolvesGrid from '@/widgets/transfer-solves/ui/SolvesGrid'
import useTransferSolves from '@/widgets/transfer-solves/model/useTransferSolves'
import { Button } from '@/components/ui/button'

export default function TransferSolvesPage() {
  const {
    cubes,
    isTransferring,
    setSourceCollection,
    setDestinationCollection,
    sourceCollection,
    destinationCollection,
    selectedSolves,
    handleTransfer,
    displaySolves,
    handleToggleAll,
    t
  } = useTransferSolves()

  useEffect(() => {
    if (!cubes || cubes.length === 0) {
      setSourceCollection(null)
      setDestinationCollection(null)
      return
    }

    if (sourceCollection && !cubes.some((cube) => cube.id === sourceCollection)) setSourceCollection(null)
    if (destinationCollection && !cubes.some((cube) => cube.id === destinationCollection))
      setDestinationCollection(null)
  }, [sourceCollection, destinationCollection, cubes])

  return (
    <div className={'h-dvh flex flex-col relative'}>
      <TransferSolvesHeader
        cubes={cubes || []}
        isTransferring={isTransferring}
        handleTransfer={handleTransfer}
        selectedSolves={selectedSolves.length}
      />
      <SolvesGrid selectedSolves={selectedSolves} displaySolves={displaySolves} />

      {selectedSolves.length > 0 && (
        <div className={'w-full bg-primary text-primary-foreground px-2 pb-2'}>
          <div className={'flex justify-between items-center mt-2 mb-4'}>
            <div data-testid="solves-selected-counter">{t('solves-selected', { count: selectedSolves.length })}</div>
            <div className={'flex gap-2'}>
              <Button
                data-testid="select-all-button"
                variant={selectedSolves.length === displaySolves.length ? 'outline' : 'ghost'}
                onClick={() => handleToggleAll('select')}
              >
                {t('select-all')}
              </Button>
              <Button variant={'outline'} onClick={() => handleToggleAll('deselect')} data-testid="deselect-all-button">
                {t('deselect-all')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
