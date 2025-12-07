'use client'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import { useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import TransferSolvesHeader from '@/widgets/navigation-header/ui/TransferSolvesHeader'
import SolvesGrid from '@/widgets/transfer-solves/ui/SolvesGrid'
import useTransferSolves from '@/widgets/transfer-solves/model/useTransferSolves'

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
    handleToggleAll
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
  }, [sourceCollection, destinationCollection, cubes, setSourceCollection, setDestinationCollection])

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <FadeIn>
        <div className="px-2 pt-2 flex flex-col w-full min-h-full">
          <TransferSolvesHeader
            cubes={cubes || []}
            isTransferring={isTransferring}
            handleTransfer={handleTransfer}
            selectedSolves={selectedSolves.length}
          />
          <SolvesGrid selectedSolves={selectedSolves} displaySolves={displaySolves} handleToggleAll={handleToggleAll} />
        </div>
      </FadeIn>
    </ScrollArea>
  )
}
