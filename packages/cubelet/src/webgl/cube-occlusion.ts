import type { BeveledCubie } from './beveled-cubie'

const FALLOFF = 0.1
const GRAZING_SHARE = 0.35

export function cubieOcclusion(
  cubie: BeveledCubie,
  halfSize: number,
  isOutward: (axis: number, sign: 1 | -1) => boolean
): Float32Array {
  const count = cubie.positions.length / 3
  const visibility = new Float32Array(count)
  const falloff = FALLOFF * halfSize
  for (let vertex = 0; vertex < count; vertex++) {
    let occlusion = 0
    for (let axis = 0; axis < 3; axis++) {
      const coordinate = cubie.positions[vertex * 3 + axis]!
      if (coordinate === 0) continue
      const sign = coordinate > 0 ? 1 : -1
      if (isOutward(axis, sign)) continue
      const distance = Math.max(halfSize - Math.abs(coordinate), 0)
      const facing = Math.max(cubie.normals[vertex * 3 + axis]! * sign, 0)
      occlusion += Math.exp(-distance / falloff) * (GRAZING_SHARE + (1 - GRAZING_SHARE) * facing)
    }
    visibility[vertex] = 1 - Math.min(occlusion, 1)
  }
  return visibility
}
