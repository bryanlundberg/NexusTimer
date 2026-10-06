import { useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { ArrowRightIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Cube } from '@/entities/cube/model/types'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { useTransferSolvesStore } from '@/widgets/transfer-solves/model/useTransferSolvesStore'
import CubeOption from '@/widgets/transfer-solves/ui/CubeOption'
import FieldLabel from '@/widgets/transfer-solves/ui/FieldLabel'
import { getCategoryOrder } from '@/shared/const/cube-categories'
import { cn } from '@/shared/lib/utils'

interface TransferSolvesHeaderProps {
  cubes: Cube[]
}

export default function TransferSolvesHeader({ cubes }: TransferSolvesHeaderProps) {
  const clearSelectedSolves = useTransferSolvesStore((s) => s.clearSelectedSolves)
  const t = useTranslations('Index.TransferSolvesPage')
  const [sourceCollection, setSourceCollection] = useQueryState(STATES.TRANSFER_SOLVES_PAGE.SOURCE_COLLECTION.KEY, {
    defaultValue: STATES.TRANSFER_SOLVES_PAGE.SOURCE_COLLECTION.DEFAULT_VALUE
  })
  const [destinationCollection, setDestinationCollection] = useQueryState(
    STATES.TRANSFER_SOLVES_PAGE.DESTINATION_COLLECTION.KEY,
    { defaultValue: STATES.TRANSFER_SOLVES_PAGE.DESTINATION_COLLECTION.DEFAULT_VALUE }
  )

  const sortedCubes = useMemo(
    () =>
      (cubes ?? [])
        .slice()
        .sort((a, b) => getCategoryOrder(a.category) - getCategoryOrder(b.category) || a.name.localeCompare(b.name)),
    [cubes]
  )

  const isReady = !!sourceCollection && !!destinationCollection

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 w-full">
      <div className={'flex flex-col gap-1 grow md:flex-row md:items-end md:gap-2 w-full'}>
        <div className="flex w-full min-w-0 flex-col gap-1.5">
          <FieldLabel color="var(--cube-blue)">{t('collection-origin')}</FieldLabel>
          <Select
            value={sourceCollection}
            onValueChange={(value) => {
              setSourceCollection(value)
              setDestinationCollection('')
              clearSelectedSolves()
            }}
          >
            <SelectTrigger className="w-full" data-testid="source-collection-trigger">
              <SelectValue placeholder={t('collection-origin')} />
            </SelectTrigger>
            <SelectContent data-testid="source-collection-content">
              {sortedCubes.map((cube) => (
                <SelectItem key={cube.id} value={cube.id} data-testid={`source-collection-${cube.name}`}>
                  <CubeOption cube={cube} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className={'flex items-center justify-center py-1 md:py-0'}>
          <span
            className={cn(
              'chip-notch chip-notch-sm flex size-9 items-center justify-center transition-colors duration-300',
              isReady ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
            )}
          >
            <ArrowRightIcon className={'size-4 rotate-90 md:rotate-0'} />
          </span>
        </div>
        <div className="flex w-full min-w-0 flex-col gap-1.5">
          <FieldLabel color="var(--cube-green)">{t('collection-destination')}</FieldLabel>
          <Select value={destinationCollection} onValueChange={setDestinationCollection} disabled={!sourceCollection}>
            <SelectTrigger
              className="w-full"
              aria-invalid={!!sourceCollection && !destinationCollection}
              data-testid="destination-collection-trigger"
            >
              <SelectValue placeholder={t('collection-destination')} />
            </SelectTrigger>
            <SelectContent data-testid="destination-collection-content">
              {sortedCubes
                .filter((cube) => cube.id !== sourceCollection)
                .map((cube) => (
                  <SelectItem key={cube.id} value={cube.id} data-testid={`destination-collection-${cube.name}`}>
                    <CubeOption cube={cube} />
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
