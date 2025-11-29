import { Solve } from '@/entities/solve/model/types'
import formatTime from '@/shared/lib/formatTime'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { deleteSolve } from '@/features/manage-solves/api/deleteSolve'
import { toggleDNF } from '@/features/manage-solves/api/toggleDNF'
import { togglePlus2 } from '@/features/manage-solves/api/togglePlus2'
import { toggleBookmark } from '@/features/manage-solves/api/toggleBookmark'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { SolveTab } from '@/shared/types/enums'

export default function useQuickActions(solve: Solve) {
  const router = useRouter()
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const setSelectedCube = useTimerStore((store) => store.setSelectedCube)
  const setCubes = useTimerStore((store) => store.setCubes)
  const cubes = useTimerStore((store) => store.cubes)
  const { open, close, activeOverlay } = useOverlayStore()

  const handleToggleBookmark = async (solveTab: SolveTab) => {
    if (!selectedCube) return
    const { cubeId, id: solveId } = solve
    await toggleBookmark({ cubeId, solveId, bookmark: !solve.bookmark, solveTab })
    syncUI(solveTab)
  }

  const handleToggleDNF = async (solveTab: SolveTab) => {
    const { cubeId, id: solveId } = solve
    await toggleDNF({ cubeId, solveId, dnf: !solve.dnf, solveTab })
    syncUI(solveTab)
  }

  const handleTogglePlus2 = async (solveTab: SolveTab) => {
    const { cubeId, id: solveId } = solve
    await togglePlus2({ cubeId, solveId, plus2: !solve.plus2, solveTab })
    syncUI(solveTab)
  }

  const handleDeleteSolve = async (solveTab: SolveTab) => {
    const { cubeId, id: solveId } = solve
    await deleteSolve({ cubeId, solveId, solveTab })
    syncUI(solveTab)

    toast.success(`Solve ${formatTime(solve.time)} deleted`, { duration: 1500 })
  }

  const handleClipboard = (customMessage?: { title?: string; description?: string }) => {
    if ('clipboard' in navigator && solve) {
      navigator.clipboard.writeText(`${formatTime(solve.time)} - ${solve.scramble}`)
    }

    toast(customMessage?.title || '', {
      description: customMessage?.description || 'Copied to clipboard',
      duration: 1000
    })
  }

  const handleTransferCollection = () => {
    if (!selectedCube) return
    router.push(`/transfer-solves?source-collection=${selectedCube.id}`) // TODO: change source-collection to constant
    close()
  }

  const handleMoveToHistorial = async () => {
    const { cubeId, id: solveId } = solve
    // TODO: implement move to history
  }

  const syncUI = async (solveTab: SolveTab) => {
    const updatedCube = await cubesDB.getById(selectedCube?.id || '')
    setSelectedCube(updatedCube || null)
    setCubes(cubes ? cubes.map((cube) => (cube.id === updatedCube?.id ? updatedCube : cube)) : [])

    const list =
      solveTab.toLowerCase() === SolveTab.SESSION.toLowerCase() ? updatedCube?.solves.session : updatedCube?.solves.all
    const updatedSolve = list?.find((s) => s.id === solve.id && !s.isDeleted)

    if (!updatedSolve) {
      close()
      return
    }

    open({
      id: activeOverlay?.id || '',
      metadata: updatedSolve,
      component: activeOverlay?.component || null
    })
  }

  return {
    handleToggleBookmark,
    handleToggleDNF,
    handleTogglePlus2,
    handleDeleteSolve,
    handleClipboard,
    handleTransferCollection,
    handleMoveToHistorial
  }
}
