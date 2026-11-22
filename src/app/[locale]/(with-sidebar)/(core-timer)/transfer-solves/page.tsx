'use client'
import { useEffect } from 'react'
import TransferSolvesHeader from '@/widgets/navigation-header/ui/TransferSolvesHeader'
import SolvesGrid from '@/widgets/transfer-solves/ui/SolvesGrid'
import useTransferSolves from '@/widgets/transfer-solves/model/useTransferSolves'
import { Button } from '@/components/ui/button'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { useTranslations } from 'next-intl'
import { ArrowRightLeft, ListChecks } from 'lucide-react'

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

  const tRail = useTranslations('Index.SolvesRail')
  const allSelected = displaySolves.length > 0 && selectedSolves.length === displaySolves.length

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
        <TransferSolvesHeader cubes={cubes || []} />
        {sourceCollection && displaySolves.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground tabular-nums">
            {tRail('solves', { count: displaySolves.length })}
          </p>
        )}
      </PageBody>
      <SolvesGrid selectedSolves={selectedSolves} displaySolves={displaySolves} hasSource={!!sourceCollection} />

      {selectedSolves.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 z-20 px-3 pb-3 drop-shadow-[0_8px_24px_rgb(0_0_0/0.35)]">
          <div className="dialog-shell animate-in slide-in-from-bottom-4 fade-in-0 relative mx-auto grid max-w-2xl grid-cols-[1fr_auto_1fr] items-center gap-2 p-2 text-foreground duration-300 ease-out">
            <Button
              data-testid="toggle-all-button"
              variant="ghost"
              size="sm"
              className="justify-self-start gap-1.5 bg-muted pointer-coarse:h-10 hover:bg-muted/70 dark:bg-muted/50 dark:hover:bg-muted/70"
              onClick={() => handleToggleAll(allSelected ? 'deselect' : 'select')}
            >
              <ListChecks className="size-3.5" />
              <span className="text-xs">{allSelected ? t('deselect-all') : t('select-all')}</span>
            </Button>
            <span
              data-testid="solves-selected-counter"
              className="truncate text-center text-sm font-medium tabular-nums"
            >
              {t('solves-selected', { count: selectedSolves.length })}
            </span>
            <Button
              data-testid="transfer-solves-button"
              size="sm"
              className="btn-notch-br justify-self-end gap-1.5 font-semibold pointer-coarse:h-10"
              onClick={handleTransfer}
              disabled={
                !sourceCollection ||
                !destinationCollection ||
                sourceCollection === destinationCollection ||
                isTransferring ||
                selectedSolves.length === 0
              }
            >
              <ArrowRightLeft className="size-3.5" />
              <span className="text-xs">{isTransferring ? t('transferring') : t('transfer')}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
