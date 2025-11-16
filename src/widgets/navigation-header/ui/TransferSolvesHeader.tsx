import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { ArrowRightIcon } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useTranslations } from 'next-intl'
import { Cube } from '@/entities/cube/model/types'
import { useQueryState } from 'nuqs'
import { STATES } from '@/constants/states'
import Navigation from '@/features/navigation/ui/navigation'

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
  const t = useTranslations('Index.TransferSolvesPage')
  const [sourceCollection, setSourceCollection] = useQueryState(STATES.TRANSFER_SOLVES_PAGE.SOURCE_COLLECTION.KEY, {
    defaultValue: STATES.TRANSFER_SOLVES_PAGE.SOURCE_COLLECTION.DEFAULT_VALUE
  })
  const [destinationCollection, setDestinationCollection] = useQueryState(
    STATES.TRANSFER_SOLVES_PAGE.DESTINATION_COLLECTION.KEY,
    { defaultValue: STATES.TRANSFER_SOLVES_PAGE.DESTINATION_COLLECTION.DEFAULT_VALUE }
  )

  return (
    <Navigation showMenu={false}>
      <div className={'flex gap-2 items-center'}>
        <SidebarTrigger />
        <div className={'flex flex-col gap-1 grow md:flex-row'}>
          <Select
            value={sourceCollection}
            onValueChange={(value) => {
              setSourceCollection(value)
              setDestinationCollection('')
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('collection-origin')} />
            </SelectTrigger>
            <SelectContent>
              {cubes?.map((cube) => (
                <SelectItem key={cube.id} value={cube.id}>
                  {cube.name} ({cube.category})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className={'flex items-center justify-center'}>
            <ArrowRightIcon className={'size-4 rotate-90 md:rotate-0'} />
          </div>
          <Select value={destinationCollection} onValueChange={setDestinationCollection}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('collection-destination')} />
            </SelectTrigger>
            <SelectContent>
              {cubes
                ?.filter((cube) => cube.id !== sourceCollection)
                .map((cube) => (
                  <SelectItem key={cube.id} value={cube.id}>
                    {cube.name} ({cube.category})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <Button
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
    </Navigation>
  )
}
