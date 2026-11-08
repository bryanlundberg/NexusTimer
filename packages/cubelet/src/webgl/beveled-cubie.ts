export interface BevelShape {
  readonly halfSize: number
  readonly outerAxisRadius: number
  readonly innerEdgeRadius: number
  readonly innerCornerRadius: number
  readonly cornerSharpness: number
  readonly segments: number
}

export interface BeveledFace {
  readonly axis: number
  readonly sign: 1 | -1
  readonly vertexStart: number
}

export interface BeveledCubie {
  readonly positions: Float32Array
  readonly normals: Float32Array
  readonly faces: readonly BeveledFace[]
  readonly verticesPerFace: number
  readonly faceIndexPattern: Uint32Array
}

type Vec3 = [number, number, number]

const FACE_ORDER: ReadonlyArray<readonly [axis: number, sign: 1 | -1]> = [
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [2, 1],
  [2, -1]
]

const clamp = (value: number, bound: number) => Math.min(Math.max(value, -bound), bound)

const unit = (axis: number, sign: number): Vec3 => {
  const vector: Vec3 = [0, 0, 0]
  vector[axis] = sign
  return vector
}

const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0]
]

export const faceKey = (axis: number, sign: number) => axis * 2 + (sign > 0 ? 0 : 1)

export function beveledCubie(shape: BevelShape, isOutward: (axis: number, sign: 1 | -1) => boolean): BeveledCubie {
  const { halfSize, outerAxisRadius, innerEdgeRadius, innerCornerRadius, cornerSharpness, segments } = shape
  const maxRadius = Math.max(outerAxisRadius, innerEdgeRadius, innerCornerRadius)
  if (!(Math.min(outerAxisRadius, innerEdgeRadius, innerCornerRadius) > 0 && maxRadius < halfSize)) {
    throw new RangeError('Every radius must be positive and smaller than the half-size')
  }

  const outward = [0, 1, 2].map((axis) => [isOutward(axis, -1) ? 1 : 0, isOutward(axis, 1) ? 1 : 0] as const)
  const inner = halfSize - maxRadius
  const samples: number[] = []
  for (let i = 0; i <= segments; i++) samples.push(-halfSize + (maxRadius * i) / segments)
  for (let i = 0; i <= segments; i++) samples.push(inner + (maxRadius * i) / segments)
  const gridSize = samples.length

  const radiiAt = (p: Vec3): Vec3 => {
    const towardCorner = (Math.abs(p[0] * p[1] * p[2]) / halfSize ** 3) ** cornerSharpness
    const outerness: Vec3 = [0, 0, 0]
    let outwardCount = 0
    for (let axis = 0; axis < 3; axis++) {
      const towardPositive = (p[axis]! / halfSize + 1) / 2
      outerness[axis] = towardPositive * outward[axis]![1] + (1 - towardPositive) * outward[axis]![0]
      outwardCount += outerness[axis]!
    }
    const interiorCorner = Math.min(Math.max(2 - outwardCount, 0), 1)
    return [0, 1, 2].map((axis) => {
      const alongEdge = innerEdgeRadius + (outerAxisRadius - innerEdgeRadius) * outerness[axis]!
      const atCorner = innerCornerRadius + (outerAxisRadius - innerCornerRadius) * outerness[axis]!
      return alongEdge + (atCorner - alongEdge) * towardCorner * interiorCorner
    }) as Vec3
  }

  const positions: number[] = []
  const normals: number[] = []
  const faces: BeveledFace[] = []
  for (const [axis, sign] of FACE_ORDER) {
    const normal = unit(axis, sign)
    const u: Vec3 = [normal[1], normal[2], normal[0]]
    const v = cross(normal, u)
    faces.push({ axis, sign, vertexStart: positions.length / 3 })
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const point = [0, 1, 2].map((k) => u[k]! * samples[i]! + v[k]! * samples[j]! + normal[k]! * halfSize) as Vec3
        const radii = radiiAt(point)
        const core = [0, 1, 2].map((k) => clamp(point[k]!, halfSize - radii[k]!)) as Vec3
        const offset = [0, 1, 2].map((k) => (point[k]! - core[k]!) / radii[k]!) as Vec3
        const length = Math.hypot(...offset) || 1
        for (let k = 0; k < 3; k++) {
          const direction = offset[k]! / length
          positions.push(core[k]! + direction * radii[k]!)
          normals.push(direction)
        }
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
