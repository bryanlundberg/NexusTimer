import { useNXData } from '@/hooks/useNXData'
import { useTranslations } from 'next-intl'
import { useTimerStore } from '@/store/timerStore'
import { useQueryState } from 'nuqs'
import { useMemo, useState } from 'react'
import { sort } from 'fast-sort'
import { Solve } from '@/interfaces/Solve'
import { toast } from 'sonner'
import { useTransferSolvesStore } from '@/widgets/transfer-solves/model/useTransferSolvesStore'
import { STATES } from '@/shared/const/states'
import useRemoveGridHeight from '@/shared/model/solves-grid/useRemoveGridHeight'

export default function useTransferSolves() {
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
  const selectedSolves = useTransferSolvesStore((s) => s.selectedSolves)
  const setSelectedSolves = useTransferSolvesStore((s) => s.setSelectedSolves)
  const clearSelectedSolves = useTransferSolvesStore((s) => s.clearSelectedSolves)
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
        clearSelectedSolves()
      }
    } catch (error) {
      console.error('Error transferring solves:', error)
      toast.error(t('failed-transfer'))
    } finally {
      setIsTransferring(false)
    }
  }

  return {
    cubes,
    sourceCollection,
    setSourceCollection,
    destinationCollection,
    setDestinationCollection,
    selectedSolves,
    setSelectedSolves,
    isTransferring,
    displaySolves,
    handleToggleAll,
    handleTransfer
  }
}
