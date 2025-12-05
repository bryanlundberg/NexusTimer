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
import moveSolveSession from '@/features/manage-solves/api/moveSolveSession'

export default function useQuickActions(solve: Solve) {
  const router = useRouter()
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const setSelectedCube = useTimerStore((store) => store.setSelectedCube)
  const setCubes = useTimerStore((store) => store.setCubes)
  const cubes = useTimerStore((store) => store.cubes)
  const { open, close, activeOverlay } = useOverlayStore()
  const setLastSolve = useTimerStore((store) => store.setLastSolve)
  const lastSolve = useTimerStore((store) => store.lastSolve)

  const inferSolveTab = async (): Promise<SolveTab | null> => {
    const cube = await cubesDB.getById(solve.cubeId)
    if (!cube) return null
    if (cube.solves.session.some((s) => s.id === solve.id && !s?.isDeleted)) return SolveTab.SESSION
    if (cube.solves.all.some((s) => s.id === solve.id && !s?.isDeleted)) return SolveTab.ALL
    return null
  }

  const handleToggleBookmark = async () => {
    if (!selectedCube) return
    const { cubeId, id: solveId } = solve
    const tab = await inferSolveTab()
    if (!tab) return
    await toggleBookmark({ cubeId, solveId, bookmark: !solve.bookmark, solveTab: tab })
    syncUI()
  }

  const handleToggleDNF = async () => {
    const { cubeId, id: solveId } = solve
    const tab = await inferSolveTab()
    if (!tab) return
    await toggleDNF({ cubeId, solveId, dnf: !solve.dnf, solveTab: tab })
    syncUI()
  }

  const handleTogglePlus2 = async () => {
    const { cubeId, id: solveId } = solve
    const tab = await inferSolveTab()
    if (!tab) return
    await togglePlus2({ cubeId, solveId, plus2: !solve.plus2, solveTab: tab })
    syncUI()
  }

  const handleDeleteSolve = async () => {
    const { cubeId, id: solveId } = solve
    const tab = await inferSolveTab()
    if (!tab) return
    await deleteSolve({ cubeId, solveId, solveTab: tab })
    syncUI()

    toast.success(`Solve ${formatTime(solve.time)} deleted`, { duration: 1500 })
  }

  const handleClipboard = (customMessage?: { title?: string; description?: string }) => {
    if ('clipboard' in navigator && solve) {
      const textNormal = `${formatTime(solve.time)}${solve.plus2 && '+'}  ${solve.scramble}`
      const textDNF = `DNF (${formatTime(solve.time)})  ${solve.scramble}`

      if (solve.dnf) navigator.clipboard.writeText(textDNF)
      else navigator.clipboard.writeText(textNormal)
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
    const currentTab = await inferSolveTab()
    if (!currentTab) return

    await moveSolveSession({ cubeId, solveId, fromTab: currentTab })

    const selectedCubeUpdated = await cubesDB.getById(cubeId)
    if (!selectedCubeUpdated) return

    setSelectedCube(selectedCubeUpdated)

    if (cubes) {
      setCubes(cubes.map((cube) => (cube.id === selectedCubeUpdated.id ? selectedCubeUpdated : cube)))
    }

    toast.success(`Solve ${formatTime(solve.time)} moved`, { duration: 1500 })
    close()
  }

  const syncUI = async () => {
    const updatedCube = await cubesDB.getById(selectedCube?.id || '')
    setSelectedCube(updatedCube || null)

    if (cubes && updatedCube) {
      setCubes(cubes.map((cube) => (cube.id === updatedCube.id ? updatedCube : cube)))
    }

    let updatedSolve = updatedCube?.solves.session.find((s) => s.id === solve.id && !s.isDeleted)
    if (!updatedSolve) {
      updatedSolve = updatedCube?.solves.all.find((s) => s.id === solve.id && !s.isDeleted)
    }

    if (!updatedSolve) {
      close()
      return
    }

    setLastSolve(lastSolve?.id === updatedSolve.id ? updatedSolve : null)

    if (activeOverlay) {
      open({
        id: activeOverlay?.id || '',
        metadata: updatedSolve,
        component: activeOverlay?.component || null
      })
    }
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
