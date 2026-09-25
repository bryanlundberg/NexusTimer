import { Solve } from '@/entities/solve/model/types'
import { Cube } from '@/entities/cube/model/types'
import formatTime from '@/shared/lib/formatTime'
import { toast } from 'sonner'
import { useRouter } from '@/shared/config/i18n/navigation'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { deleteSolve } from '@/features/manage-solves/api/deleteSolve'
import { toggleDNF } from '@/features/manage-solves/api/toggleDNF'
import { togglePlus2 } from '@/features/manage-solves/api/togglePlus2'
import { toggleBookmark } from '@/features/manage-solves/api/toggleBookmark'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { SolveTab } from '@/shared/types/enums'
import moveSolveSession from '@/features/manage-solves/api/moveSolveSession'
import { updateComment } from '@/features/manage-solves/api/updateComment'

export default function useQuickActions(solve: Solve) {
  const router = useRouter()
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const patchCube = useTimerStore((store) => store.patchCube)
  const { open, close, activeOverlay } = useOverlayStore()
  const setLastSolve = useTimerStore((store) => store.setLastSolve)
  const lastSolve = useTimerStore((store) => store.lastSolve)

  const tabIn = (cube: Cube | undefined): SolveTab | null => {
    if (!cube) return null
    if (cube.solves.session.some((s) => s.id === solve.id && !s?.isDeleted)) return SolveTab.SESSION
    if (cube.solves.all.some((s) => s.id === solve.id && !s?.isDeleted)) return SolveTab.ALL
    return null
  }

  const inferSolveTab = async (): Promise<SolveTab | null> => {
    const cached = useTimerStore.getState().cubes?.find((cube) => cube.id === solve.cubeId)
    return tabIn(cached) ?? tabIn(await cubesDB.getById(solve.cubeId).catch(() => undefined))
  }

  const handleToggleBookmark = async () => {
    if (!selectedCube) return
    const { cubeId, id: solveId } = solve
    const tab = await inferSolveTab()
    if (!tab) return

    const newBookmarkStatus = !solve.bookmark

    syncUI(await toggleBookmark({ cubeId, solveId, bookmark: newBookmarkStatus, solveTab: tab }))
  }

  const handleToggleDNF = async () => {
    const { cubeId, id: solveId } = solve
    const tab = await inferSolveTab()
    if (!tab) return
    syncUI(await toggleDNF({ cubeId, solveId, dnf: !solve.dnf, solveTab: tab }))
  }

  const handleTogglePlus2 = async () => {
    const { cubeId, id: solveId } = solve
    const tab = await inferSolveTab()
    if (!tab) return
    syncUI(await togglePlus2({ cubeId, solveId, plus2: !solve.plus2, solveTab: tab }))
  }

  const handleDeleteSolve = async () => {
    const { cubeId, id: solveId } = solve
    const tab = await inferSolveTab()
    if (!tab) return

    syncUI(await deleteSolve({ cubeId, solveId, solveTab: tab }))
  }

  const handleClipboard = (customMessage?: { title?: string; description?: string }) => {
    if ('clipboard' in navigator && solve) {
      const textNormal = `${formatTime(solve.time)}${solve.plus2 ? '+' : ''}  ${solve.scramble}`
      const textDNF = `DNF (${formatTime(solve.time)})  ${solve.scramble}`

      if (solve.dnf) navigator.clipboard.writeText(textDNF)
      else navigator.clipboard.writeText(textNormal)
    }

    toast(customMessage?.title || '', {
      description: customMessage?.description || 'Copied to clipboard',
      duration: 1000
    })
  }

  const handleCopyScramble = () => {
    if ('clipboard' in navigator && solve?.scramble) {
      navigator.clipboard.writeText(solve.scramble)
      toast('', { description: 'Copied to clipboard', duration: 1000 })
    }
  }

  const handleUpdateComment = async (comment: string) => {
    const { cubeId, id: solveId } = solve
    const tab = await inferSolveTab()
    if (!tab) return
    syncUI(await updateComment({ cubeId, solveId, comment, solveTab: tab }))
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

    patchCube(await moveSolveSession({ cubeId, solveId, fromTab: currentTab }))

    toast.success(`Solve ${formatTime(solve.time)} moved`, { duration: 1500 })
    close()
  }

  const syncUI = (updatedCube: Cube) => {
    patchCube(updatedCube)

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
    handleCopyScramble,
    handleUpdateComment,
    handleTransferCollection,
    handleMoveToHistorial
  }
}
