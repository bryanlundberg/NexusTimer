import CubesList from '@/features/manage-cubes/ui/CubesList'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import EmptyCubes from '@/features/manage-cubes/ui/EmptyCubes'

export default function CubesDashboard() {
  const cubes = useTimerStore((store) => store.cubes)
  return cubes?.length ? <CubesList cubes={cubes} /> : <EmptyCubes />
}
