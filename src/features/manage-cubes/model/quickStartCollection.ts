import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { createCubeCollection } from '@/features/manage-cubes/api/createCubeCollection'

export const QUICK_START_CATEGORIES = ['3x3', '2x2', '3x3 OH'] as const satisfies readonly CubeCategory[]

export async function quickStartCollection(category: CubeCategory): Promise<Cube> {
  const cube = await createCubeCollection({ name: category, category })
  const { patchCubes, setSelectedCube, setNewScramble } = useTimerStore.getState()
  patchCubes([cube])
  setSelectedCube(cube)
  setNewScramble(cube)
  return cube
}
