import { Cube } from '@/entities/cube/model/types'

export function memoByCubesAndDay<T>(compute: (cubes: Cube[] | null) => T) {
  let lastCubes: Cube[] | null | undefined
  let lastDay = ''
  let lastResult: T

  return (cubes: Cube[] | null): T => {
    const day = new Date().toDateString()
    if (cubes !== lastCubes || day !== lastDay) {
      lastResult = compute(cubes)
      lastCubes = cubes
      lastDay = day
    }
    return lastResult
  }
}
