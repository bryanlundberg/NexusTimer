import { Solve } from '@/entities/solve/model/types'
import { solvesDB } from '@/entities/solve/api/indexdb'
import { SolveTab } from '@/enums/SolveTab'
import formatTime from '@/shared/lib/formatTime'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useTimerStore } from '@/store/timerStore'

export default function useQuickActions(solve: Solve) {
  const router = useRouter()
  const selectedCube = useTimerStore((store) => store.selectedCube)

  const handleToggleBookmark = async (solveTab: SolveTab) => {
    const { cubeId, id: solveId } = solve
    return await solvesDB.toggleBookmarkById(cubeId, solveId, !solve.bookmark, solveTab)
  }

  const handleToggleDNF = async (solveTab: SolveTab) => {
    const { cubeId, id: solveId } = solve
    return await solvesDB.toggleDNFById(cubeId, solveId, !solve.dnf, solveTab)
  }

  const handleTogglePlus2 = async (solveTab: SolveTab) => {
    const { cubeId, id: solveId } = solve
    return await solvesDB.togglePlus2ById(cubeId, solveId, !solve.plus2, solveTab)
  }

  const handleDeleteSolve = async (solveTab: SolveTab) => {
    const { cubeId, id: solveId } = solve
    return await solvesDB.deleteById(cubeId, solveId, solveTab)
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
    router.push(`/transfer-solves?source-collection=${selectedCube.id}`)
  }

  const handleMoveToHistorial = async () => {
    const { cubeId, id: solveId } = solve
    // TODO: implement move to history
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
