import { Solve } from '@/entities/solve/model/types'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import SolveDetails from '@/features/manage-solves/ui/SolveDetails'

export default function useSolveGridItem(solve: Solve) {
  const { open } = useOverlayStore()

  const handleOpenSolveDetails = () => {
    open({
      id: 'solve-details',
      metadata: { ...solve },
      component: <SolveDetails />
    })
  }

  return {
    handleOpenSolveDetails
  }
}
