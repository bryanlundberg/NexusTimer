import type { Cube } from '@/interfaces/Cube'
import type { Solve } from '@/interfaces/Solve'
import { CubeCategory } from '@/shared/config/cube-categories'

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
