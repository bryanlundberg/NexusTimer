import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { ReplaySolveDetails } from '@/features/replay-solve-details/ui/ReplaySolveDetails'
import type { LeaderboardSolve } from '@nexustimer/contracts'

export default function useLeaderboardRow(solve: LeaderboardSolve) {
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
