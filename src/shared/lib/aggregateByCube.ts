import { CubeCategory } from '@/shared/config/cube-categories'
import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'

export function aggregateByCube(cubes: Cube[], category: CubeCategory) {
  const filtered = category ? cubes.filter((c) => c.category === category) : cubes

  return filtered.map((cube) => {
    const solvesAll: Solve[] = [...(cube.solves?.all || []), ...(cube.solves?.session || [])]
    const successful = solvesAll.filter((s) => !s.dnf)
    const solvesCount = successful.length
    const totalTimeMs = successful.reduce((acc, s) => acc + (s.time || 0), 0)
    return {
      id: cube.id,
      name: cube.name || 'Cube',
      solvesCount,
      totalTimeMs
    }
  })
}
