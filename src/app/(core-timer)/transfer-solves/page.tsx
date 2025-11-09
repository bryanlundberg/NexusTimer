'use client'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import Navigation from '@/components/navigation/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from 'lucide-react'
import { useTimerStore } from '@/store/timerStore'
import { useEffect, useMemo, useState } from 'react'
import useRemoveGridHeight from '@/hooks/useRemoveGridHeight'
import { VirtualizedGrid } from '@mierak/react-virtualized-grid'
import { Card } from '@/components/ui/card'
import formatTime from '@/lib/formatTime'
import formatDate from '@/lib/formatDate'
import { toast } from 'sonner'
import { useQueryState } from 'nuqs'
import { STATES } from '@/constants/states'
import { sort } from 'fast-sort'
import { useTranslations } from 'next-intl'
import { useNXData } from '@/hooks/useNXData'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Solve } from '@/interfaces/Solve'

export default function TransferSolvesPage() {
  const { saveBatchCubes, getAllCubes } = useNXData()
  const t = useTranslations('Index.TransferSolvesPage')
  const cubes = useTimerStore((state) => state.cubes)
  const setCubes = useTimerStore((state) => state.setCubes)
  const [sourceCollection, setSourceCollection] = useQueryState(STATES.TRANSFER_SOLVES_PAGE.SOURCE_COLLECTION.KEY, {
    defaultValue: STATES.TRANSFER_SOLVES_PAGE.SOURCE_COLLECTION.DEFAULT_VALUE
  })
  const [destinationCollection, setDestinationCollection] = useQueryState(
    STATES.TRANSFER_SOLVES_PAGE.DESTINATION_COLLECTION.KEY,
    { defaultValue: STATES.TRANSFER_SOLVES_PAGE.DESTINATION_COLLECTION.DEFAULT_VALUE }
  )
  const [selectedSolves, setSelectedSolves] = useState<string[]>([])
  const [isTransferring, setIsTransferring] = useState<boolean>(false)
  useRemoveGridHeight(sourceCollection)

  const displaySolves = useMemo(() => {
    const session = cubes?.find((cube) => cube.id === sourceCollection)?.solves.session || []
    return sort(session.filter((solve) => !solve?.isDeleted)).desc((solve) => solve.endTime)
  }, [sourceCollection, cubes])

  const handleToggleAll = (type: 'select' | 'deselect') => {
    if (type === 'select') setSelectedSolves(displaySolves.map((solve) => solve.id))
    if (type === 'deselect') setSelectedSolves([])
  }

  const handleTransfer = async () => {
    if (
      !sourceCollection ||
      !destinationCollection ||
      sourceCollection === destinationCollection ||
      isTransferring ||
      selectedSolves.length === 0
    )
      return
    if (!cubes) throw new Error(t('cubes-unavailable'))
    setIsTransferring(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const sourceCube = cubes.find((cube) => cube.id === sourceCollection)
      const destinationCube = cubes.find((cube) => cube.id === destinationCollection)

      if (sourceCube && destinationCube) {
        const now = Date.now()

        const updatedSourceSession = sourceCube.solves.session.map((solve) =>
          selectedSolves.includes(solve.id) ? { ...solve, isDeleted: true, updatedAt: now } : solve
        )
        const updatedSourceAll = sourceCube.solves.all.map((solve) =>
          selectedSolves.includes(solve.id) ? { ...solve, isDeleted: true, updatedAt: now } : solve
        )

        const solvesToTransfer = sourceCube.solves.session
          .filter((solve) => selectedSolves.includes(solve.id))
          .map((solve) => ({ ...solve, cubeId: destinationCube.id, isDeleted: false, updatedAt: now }))

        const mergedDestinationSession = (() => {
          const map = new Map<string, Solve>()
          for (const s of destinationCube.solves.session) map.set(s.id, s)
          for (const s of solvesToTransfer) map.set(s.id, s)
          return Array.from(map.values())
        })()

        const updatedSourceCube = {
          ...sourceCube,
          updatedAt: now,
          solves: { ...sourceCube.solves, session: updatedSourceSession, all: updatedSourceAll }
        }

        const updatedDestinationCube = {
          ...destinationCube,
          updatedAt: now,
          solves: { ...destinationCube.solves, session: mergedDestinationSession }
        }

        await saveBatchCubes([updatedSourceCube, updatedDestinationCube])
        const updatedCubes = await getAllCubes()

        setCubes(updatedCubes)

        toast.success('Transfer successful')
        setSelectedSolves([])
      }
    } catch (error) {
      console.error('Error transferring solves:', error)
      toast.error(t('failed-transfer'))
    } finally {
      setIsTransferring(false)
    }
  }

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
                  selectedSolves.length === 0
                }
              >
                {isTransferring ? t('transferring') : t('transfer')}
              </Button>
            </div>
          </Navigation>

          {displaySolves.length > 0 ? (
            <>
              <div className={'flex justify-between items-center mt-2 mb-4'}>
                <div>{t('solves-selected', { count: selectedSolves.length })}</div>
                <div className={'flex gap-2'}>
                  <Button
                    variant={selectedSolves.length === displaySolves.length ? 'default' : 'outline'}
                    onClick={() => handleToggleAll('select')}
                  >
                    {t('select-all')}
                  </Button>
                  <Button variant={'outline'} onClick={() => handleToggleAll('deselect')}>
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
                  <Card
                    onClick={() => {
                      const solveId = displaySolves[index].id
                      setSelectedSolves((prev) => {
                        if (prev.includes(solveId)) {
                          return prev.filter((id) => id !== solveId)
                        } else {
                          return [...prev, solveId]
                        }
                      })
                    }}
                    className={`relative grow flex items-center justify-center w-auto font-medium text-center transition duration-200 rounded-md cursor-pointer h-full bg-secondary text-secondary-foreground hover:opacity-70 ${selectedSolves.find((solve) => solve === displaySolves[index].id) ? 'ring-3 ring-primary' : ''}`}
                  >
                    <div className="tracking-wider pt-2">
                      <span className="text-md">{formatTime(displaySolves[index].time).split('.')[0]}</span>
                      <span className="text-sm">.{formatTime(displaySolves[index].time).split('.')[1]}</span>
                    </div>
                    <div className="absolute z-20 text-xs top-1 left-1">
                      {formatDate(displaySolves[index].endTime).slice(0, 5)}
                    </div>
                  </Card>
                )}
              </VirtualizedGrid>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center grow mt-10">
              <h2 className="text-2xl font-bold mb-4 text-center text-balance">{t('no-solves')}</h2>
              <p className="text-gray-600 text-center text-balance">{t('empty-vault')}</p>
            </div>
          )}
        </div>
      </FadeIn>
    </ScrollArea>
  )
}
