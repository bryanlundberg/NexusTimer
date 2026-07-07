import { useMemo } from 'react'
import CubesList from '@/features/manage-cubes/ui/CubesList'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import EmptyCubes from '@/features/manage-cubes/ui/EmptyCubes'
import { getCategoryOrder } from '@/shared/const/cube-categories'

export default function CubesDashboard() {
  const cubes = useTimerStore((store) => store.cubes)

  const sortedCubes = useMemo(() => {
    if (!cubes?.length) return []
    return cubes.slice().sort((a, b) => {
      if (a.favorite !== b.favorite) return a.favorite ? -1 : 1
      const aActive = a.solves.session.length > 0
      const bActive = b.solves.session.length > 0
      if (aActive !== bActive) return aActive ? -1 : 1
      const categoryDiff = getCategoryOrder(a.category) - getCategoryOrder(b.category)
      if (categoryDiff !== 0) return categoryDiff
      return a.name.localeCompare(b.name)
    })
  }, [cubes])

  if (!cubes?.length) return <EmptyCubes className={'mx-auto w-fit'} />
  return <CubesList cubes={sortedCubes} />
}
