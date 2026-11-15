import { Cube } from '@/entities/cube/model/types'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'

export function applyCubesToStore(cubes: Cube[]) {
  const { setCubes, selectedCube, setSelectedCube } = useTimerStore.getState()
  setCubes(cubes)
  if (!selectedCube) return
  setSelectedCube(cubes.find((cube) => cube.id === selectedCube.id && !cube.isDeleted) ?? null)
}
