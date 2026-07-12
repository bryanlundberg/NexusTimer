'use client'
import { useEffect } from 'react'
import TransferSolvesHeader from '@/widgets/navigation-header/ui/TransferSolvesHeader'
import SolvesGrid from '@/widgets/transfer-solves/ui/SolvesGrid'
import useTransferSolves from '@/widgets/transfer-solves/model/useTransferSolves'
import { Button } from '@/components/ui/button'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'

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
      <CoreHeader breadcrumbs={[{ label: t('title'), href: '/transfer-solves' }]} />

      <PageBody variant="data" className="px-3">
        <TransferSolvesHeader
          cubes={cubes || []}
          isTransferring={isTransferring}
          handleTransfer={handleTransfer}
          selectedSolves={selectedSolves.length}
        />
      </PageBody>
      <SolvesGrid selectedSolves={selectedSolves} displaySolves={displaySolves} hasSource={!!sourceCollection} />

      {selectedSolves.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 z-20 px-3 pb-3">
          <div className="animate-in slide-in-from-bottom-4 fade-in-0 mx-auto flex max-w-2xl items-center gap-2 rounded-xl bg-foreground p-2 text-background shadow-xl ring-1 ring-foreground/10 duration-300 ease-out">
            <span
              data-testid="solves-selected-counter"
              className="min-w-0 flex-1 truncate ps-2 text-sm font-medium tabular-nums"
            >
              {t('solves-selected', { count: selectedSolves.length })}
            </span>
            <Button
              data-testid="select-all-button"
              variant="ghost"
              size="sm"
              className="gap-1.5 bg-background text-foreground hover:bg-background/85 hover:text-foreground dark:hover:bg-background/85"
              onClick={() => handleToggleAll('select')}
            >
              {t('select-all')}
            </Button>
            <Button
              data-testid="deselect-all-button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-background hover:bg-background/15 hover:text-background dark:hover:bg-background/15"
              onClick={() => handleToggleAll('deselect')}
            >
              {t('deselect-all')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
