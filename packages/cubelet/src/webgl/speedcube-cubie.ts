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

  const prismDistance = (p: Vec3, along: number): number => {
    const a = (along + 1) % 3
    const b = (along + 2) % 3
    const signA = p[a]! >= 0 ? 1 : -1
    const signB = p[b]! >= 0 ? 1 : -1
    const radius = cornerRadius(along, a, signA, b, signB)
    const qa = Math.abs(p[a]!) - (halfSize - radius)
    const qb = Math.abs(p[b]!) - (halfSize - radius)
    return Math.hypot(Math.max(qa, 0), Math.max(qb, 0)) + Math.min(Math.max(qa, qb), 0) - radius
  }

  const distance = (p: Vec3): number =>
    smoothMax(smoothMax(prismDistance(p, 0), prismDistance(p, 1), blend), prismDistance(p, 2), blend)

  const project = (point: Vec3): Vec3 => {
    let inside = 0
    let outside = 1
    for (let step = 0; step < PROJECTION_STEPS; step++) {
      const middle = (inside + outside) / 2
      if (distance([point[0] * middle, point[1] * middle, point[2] * middle]) < 0) inside = middle
      else outside = middle
    }
    const scale = (inside + outside) / 2
    return [point[0] * scale, point[1] * scale, point[2] * scale]
  }

  const normalAt = (p: Vec3): Vec3 => {
    const gradient = [0, 1, 2].map((axis) => {
      const forward: Vec3 = [p[0], p[1], p[2]]
      const backward: Vec3 = [p[0], p[1], p[2]]
      forward[axis]! += GRADIENT_STEP
      backward[axis]! -= GRADIENT_STEP
      return distance(forward) - distance(backward)
    })
    const length = Math.hypot(...gradient) || 1
    return gradient.map((value) => value / length) as Vec3
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
