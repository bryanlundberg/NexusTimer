import CubesList from '@/features/manage-cubes/ui/CubesList'
import EmptyCubes from '@/components/cubes/EmptyCubes'
import { useTimerStore } from '@/store/timerStore'

export default function CubesDashboard() {
  const cubes = useTimerStore((store) => store.cubes)
  return cubes?.length ? <CubesList cubes={cubes} /> : <EmptyCubes />
}
