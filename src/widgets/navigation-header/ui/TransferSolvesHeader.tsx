import { useMemo } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { ArrowRightIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Cube } from '@/entities/cube/model/types'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { useTransferSolvesStore } from '@/widgets/transfer-solves/model/useTransferSolvesStore'
import { getCategoryOrder } from '@/shared/const/cube-categories'
import { cubeCollection } from '@/shared/const/cube-collection'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'

function CubeOption({ cube }: { cube: Cube }) {
  const src = cubeCollection.find((c) => c.name === cube.category)?.src
  return (
    <div className="flex w-full items-center gap-2">
      {src && <Image src={src} alt={`${cube.category} icon`} width={20} height={20} unoptimized className="shrink-0" />}
      <span className="truncate">{cube.name}</span>
      <CategoryBadge category={cube.category} className="ms-auto text-[10px]" />
    </div>
  )
}

interface TransferSolvesHeaderProps {
  cubes: Cube[]
  handleTransfer: () => void
  isTransferring: boolean
  selectedSolves: number
}

export default function TransferSolvesHeader({
  cubes,
  handleTransfer,
  isTransferring,
  selectedSolves
}: TransferSolvesHeaderProps) {
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

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 w-full">
      <div className={'flex flex-col gap-1 grow md:flex-row w-full'}>
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
        <div className={'flex items-center justify-center'}>
          <ArrowRightIcon className={'size-4 rotate-90 md:rotate-0'} />
        </div>
        <Select value={destinationCollection} onValueChange={setDestinationCollection}>
          <SelectTrigger className="w-full" data-testid="destination-collection-trigger">
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

      <Button
        data-testid="transfer-solves-button"
        onClick={handleTransfer}
        disabled={
          !sourceCollection ||
          !destinationCollection ||
          sourceCollection === destinationCollection ||
          isTransferring ||
          selectedSolves === 0
        }
      >
        {isTransferring ? t('transferring') : t('transfer')}
      </Button>
    </div>
  )
}
