import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { ReplaySolveDetails } from '@/features/replay-solve-details/ui/ReplaySolveDetails'
import { SolveServer } from '@/entities/solve/model/types'

export default function useLeaderboardRow(solve: SolveServer) {
  const { open } = useOverlayStore()

  const openModal = () => {
    open({
      id: 'leaderboard-solve-details',
      component: <ReplaySolveDetails />,
      metadata: { ...solve }
    })
  }

  return { openModal }
}
