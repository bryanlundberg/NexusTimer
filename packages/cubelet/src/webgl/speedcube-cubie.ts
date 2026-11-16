import type { BeveledCubie, BeveledFace } from './beveled-cubie'

export interface SpeedcubeShape {
  readonly halfSize: number
  readonly tileRadius: number
  readonly centerRadius?: number
  readonly edgeRadius?: number
  readonly seamRadius: number
  readonly outerRadius: number
  readonly blend: number
  readonly segments: number
}

type Vec3 = [number, number, number]
type Outward = (axis: number, sign: 1 | -1) => boolean

const FACE_ORDER: ReadonlyArray<readonly [axis: number, sign: 1 | -1]> = [
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [2, 1],
  [2, -1]
]

const PROJECTION_STEPS = 28
const ROOT_TOLERANCE = 2 ** -30
const GRADIENT_STEP = 1e-4

const smoothMax = (a: number, b: number, k: number): number => {
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.max(a, b) + (h * h * k) / 4
}

export function speedcubeCubie(shape: SpeedcubeShape, isOutward: Outward): BeveledCubie {
  const { halfSize, tileRadius, seamRadius, outerRadius, blend, segments } = shape
  const centerRadius = shape.centerRadius ?? tileRadius
  const edgeRadius = shape.edgeRadius ?? tileRadius
  if (!(
    Math.min(tileRadius, centerRadius, edgeRadius, seamRadius, outerRadius) > 0 &&
    Math.max(tileRadius, centerRadius, edgeRadius, seamRadius, outerRadius) < halfSize
  )) {
    throw new RangeError('Every radius must be positive and smaller than the half-size')
  }

  const open = [0, 1, 2].map((axis) => isOutward(axis, 1) || isOutward(axis, -1))
  const openCount = open.filter(Boolean).length
  const cornerRadius = (along: number, a: number, signA: 1 | -1, b: number, signB: 1 | -1): number => {
    const outA = isOutward(a, signA)
    const outB = isOutward(b, signB)
    if (outA && outB) return outerRadius
    if (outA || outB) return seamRadius
    if (!open[along]) return seamRadius
    if (openCount === 1) return centerRadius
    return openCount === 2 ? edgeRadius : tileRadius
  }

  const radii = new Float64Array(12)
  for (let along = 0; along < 3; along++) {
    const a = (along + 1) % 3
    const b = (along + 2) % 3
    radii[along * 4] = cornerRadius(along, a, 1, b, 1)
    radii[along * 4 + 1] = cornerRadius(along, a, 1, b, -1)
    radii[along * 4 + 2] = cornerRadius(along, a, -1, b, 1)
    radii[along * 4 + 3] = cornerRadius(along, a, -1, b, -1)
  }

  const prismDistance = (along: number, pa: number, pb: number): number => {
    const radius = radii[along * 4 + (pa >= 0 ? 0 : 2) + (pb >= 0 ? 0 : 1)]!
    const qa = Math.abs(pa) - (halfSize - radius)
    const qb = Math.abs(pb) - (halfSize - radius)
    const ma = qa > 0 ? qa : 0
    const mb = qb > 0 ? qb : 0
    return Math.sqrt(ma * ma + mb * mb) + Math.min(Math.max(qa, qb), 0) - radius
  }

  const distance = (x: number, y: number, z: number): number =>
    smoothMax(smoothMax(prismDistance(0, y, z), prismDistance(1, z, x), blend), prismDistance(2, x, y), blend)

  const bisect = (x: number, y: number, z: number): number => {
    let inside = 0
    let outside = 1
    for (let step = 0; step < PROJECTION_STEPS; step++) {
      const middle = (inside + outside) / 2
      if (distance(x * middle, y * middle, z * middle) < 0) inside = middle
      else outside = middle
    }
    return (inside + outside) / 2
  }

  const falsePosition = (x: number, y: number, z: number): number => {
    let inside = 0
    let outside = 1
    let atInside = distance(0, 0, 0)
    let atOutside = distance(x, y, z)
    if (!(atInside < 0 && atOutside >= 0)) return bisect(x, y, z)
    let kept = 0
    for (let step = 0; step < PROJECTION_STEPS * 2; step++) {
      if (outside - inside <= ROOT_TOLERANCE) break
      const guess = (inside * atOutside - outside * atInside) / (atOutside - atInside)
      const middle = guess > inside && guess < outside ? guess : (inside + outside) / 2
      const value = distance(x * middle, y * middle, z * middle)
      if (Math.abs(value) <= ROOT_TOLERANCE) return middle
      if (value < 0) {
        inside = middle
        atInside = value
        if (kept === -1) atOutside /= 2
        kept = -1
      } else {
        outside = middle
        atOutside = value
        if (kept === 1) atInside /= 2
        kept = 1
      }
    }
    return (inside + outside) / 2
  }

  const project = ([x, y, z]: Vec3): Vec3 => {
    const scale = falsePosition(x, y, z)
    return [x * scale, y * scale, z * scale]
  }

  const normalAt = ([x, y, z]: Vec3): Vec3 => {
    const gx = distance(x + GRADIENT_STEP, y, z) - distance(x - GRADIENT_STEP, y, z)
    const gy = distance(x, y + GRADIENT_STEP, z) - distance(x, y - GRADIENT_STEP, z)
    const gz = distance(x, y, z + GRADIENT_STEP) - distance(x, y, z - GRADIENT_STEP)
    const length = Math.hypot(gx, gy, gz) || 1
    return [gx / length, gy / length, gz / length]
  }

  const gridSize = segments * 2 + 1
  const samples = Array.from({ length: gridSize }, (_, i) => halfSize * Math.sin((Math.PI / 2) * (i / segments - 1)))

  const positions: number[] = []
  const normals: number[] = []
  const faces: BeveledFace[] = []
  for (const [axis, sign] of FACE_ORDER) {
    const u = (axis + 1) % 3
    const v = (axis + 2) % 3
    faces.push({ axis, sign, vertexStart: positions.length / 3 })
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const point: Vec3 = [0, 0, 0]
        point[axis] = sign * halfSize
        point[u] = samples[i]!
        point[v] = sign * samples[j]!
        const surface = project(point)
        positions.push(...surface)
        normals.push(...normalAt(surface))
      }
    }
  }

  const pattern: number[] = []
  for (let i = 0; i < gridSize - 1; i++) {
    for (let j = 0; j < gridSize - 1; j++) {
      const a = i * gridSize + j
      const b = a + gridSize
      pattern.push(a, b, b + 1, a, b + 1, a + 1)
    }
  }

  return {
    positions: Float32Array.from(positions),
    normals: Float32Array.from(normals),
    faces,
    verticesPerFace: gridSize * gridSize,
    faceIndexPattern: Uint32Array.from(pattern)
  }
}
