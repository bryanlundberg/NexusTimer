import type { Point } from '../../geometry/triangle-grid'
import { add, cross, dot, normalize, scale, subtract } from '../../geometry/vector'

export interface MoldedStyle {
  readonly segments: number
  readonly pieceScale: number
  readonly seamRounding: number
  readonly cornerRounding: number
  readonly centerReach: number
  readonly cornerProfile: 'smooth' | 'arc'
}

export const PRO_MOLDED_STYLE: MoldedStyle = {
  segments: 6,
  pieceScale: 0.985,
  seamRounding: 0.04,
  cornerRounding: 0.3,
  centerReach: 0.6,
  cornerProfile: 'smooth'
}

export const PYRAMINX_MOLDED_STYLE: MoldedStyle = {
  ...PRO_MOLDED_STYLE,
  seamRounding: 0.012,
  cornerRounding: 0.06,
  cornerProfile: 'arc'
}

export const SQUARE1_MOLDED_STYLE: MoldedStyle = {
  segments: 4,
  pieceScale: 0.985,
  seamRounding: 0.02,
  cornerRounding: 0,
  centerReach: 0,
  cornerProfile: 'smooth'
}

export type FaceRadius = (normal: Point) => number

export interface MoldedFace {
  readonly points: readonly Point[]
  readonly normal: Point
  readonly outer: boolean
}

export interface MoldedSurface {
  readonly positions: Point[]
  readonly normals: Point[]
  readonly indices: number[]
}

const MARCH_STEPS = 16
const BISECTION_STEPS = 10
const SECANT_STEPS = 12
const SURFACE_TOLERANCE = 1e-14
const GRADIENT_STEP = 1e-4

const smoothMax = (a: number, b: number, k: number): number => {
  const h = k - Math.abs(a - b)
  if (h <= 0) return a > b ? a : b
  const t = h / k
  return (a > b ? a : b) + (t * t * k) / 4
}

const packPlanes = (faces: readonly MoldedFace[]): Float64Array => {
  const planes = new Float64Array(faces.length * 4)
  faces.forEach((face, index) => {
    planes.set([face.normal[0]!, face.normal[1]!, face.normal[2]!, dot(face.normal, face.points[0]!)], index * 4)
  })
  return planes
}

const scratch: number[] = []

const foldPlanes = (planes: Float64Array, x: number, y: number, z: number, k: number): number => {
  const count = planes.length / 4
  for (let i = 0; i < count; i++) {
    scratch[i] = planes[i * 4]! * x + planes[i * 4 + 1]! * y + planes[i * 4 + 2]! * z - planes[i * 4 + 3]!
  }
  for (let i = 1; i < count; i++) {
    const value = scratch[i]!
    let j = i - 1
    while (j >= 0 && scratch[j]! > value) {
      scratch[j + 1] = scratch[j]!
      j--
    }
    scratch[j + 1] = value
  }
  let result = scratch[0]!
  for (let i = 1; i < count; i++) result = smoothMax(result, scratch[i]!, k)
  return result
}

const ON_PLANE = 1e-7

const radialDistance = (point: Point, normal: Point): number =>
  Math.hypot(...subtract(point, scale(normal, dot(point, normal))))

const arcCorner = (a: number, b: number, cosine: number, radius: number): number => {
  const insetA = a + radius
  const insetB = b + radius
  if (insetA - cosine * insetB > 0 && insetB - cosine * insetA > 0) {
    const squared = (insetA * insetA + insetB * insetB - 2 * insetA * insetB * cosine) / (1 - cosine * cosine)
    return Math.sqrt(Math.max(squared, 0)) - radius
  }
  return Math.max(insetA, insetB) - radius
}

const centerCornerPairs = (
  faces: readonly MoldedFace[],
  cuts: Float64Array,
  style: MoldedStyle,
  faceRadius: FaceRadius
): Array<readonly [number, number]> => {
  const pairs = new Map<string, readonly [number, number]>()
  if (style.cornerRounding <= 0) return []
  for (const face of faces) {
    if (!face.outer) continue
    const radial = face.points.map((point) => radialDistance(point, face.normal))
    const nearest = Math.min(...radial)
    const reach = style.centerReach * faceRadius(face.normal)
    face.points.forEach((point, index) => {
      if (radial[index]! > nearest + ON_PLANE || radial[index]! > reach) return
      const touching: number[] = []
      for (let i = 0; i < cuts.length / 4; i++) {
        const offset =
          cuts[i * 4]! * point[0]! + cuts[i * 4 + 1]! * point[1]! + cuts[i * 4 + 2]! * point[2]! - cuts[i * 4 + 3]!
        if (Math.abs(offset) < ON_PLANE) touching.push(i)
      }
      for (let a = 0; a < touching.length; a++) {
        for (let b = a + 1; b < touching.length; b++)
          pairs.set(`${touching[a]}:${touching[b]}`, [touching[a]!, touching[b]!])
      }
    })
  }
  return [...pairs.values()]
}

const faceCenter = (points: readonly Point[]): Point =>
  scale(
    points.reduce<Point>((sum, point) => add(sum, point), [0, 0, 0]),
    1 / points.length
  )

export function moldedSurface(
  faces: readonly MoldedFace[],
  center: Point,
  style: MoldedStyle,
  faceRadius: FaceRadius
): MoldedSurface[] {
  const size = Math.max(...faces.flatMap((face) => face.points.map((point) => Math.hypot(...subtract(point, center)))))
  const seam = style.seamRounding * size
  const corner = style.cornerRounding * size
  const outer = packPlanes(faces.filter((face) => face.outer))
  const cuts = packPlanes(faces.filter((face) => !face.outer))
  const [cx, cy, cz] = center as [number, number, number]
  const pairs = centerCornerPairs(faces, cuts, style, faceRadius).map(([a, b]) => ({
    a,
    b,
    cosine: cuts[a * 4]! * cuts[b * 4]! + cuts[a * 4 + 1]! * cuts[b * 4 + 1]! + cuts[a * 4 + 2]! * cuts[b * 4 + 2]!
  }))
  const roundCorner =
    style.cornerProfile === 'arc'
      ? (a: number, b: number, cosine: number) => arcCorner(a, b, cosine, corner)
      : (a: number, b: number) => smoothMax(a, b, corner)
  const cutValues = new Float64Array(cuts.length / 4)

  const cutDistance = (x: number, y: number, z: number): number => {
    let result = -Infinity
    for (let i = 0; i < cutValues.length; i++) {
      const value = cuts[i * 4]! * x + cuts[i * 4 + 1]! * y + cuts[i * 4 + 2]! * z - cuts[i * 4 + 3]!
      cutValues[i] = value
      if (value > result) result = value
    }
    for (const { a, b, cosine } of pairs) result = Math.max(result, roundCorner(cutValues[a]!, cutValues[b]!, cosine))
    return result
  }

  const distance = (x: number, y: number, z: number): number => {
    if (outer.length === 0) return foldPlanes(cuts, x, y, z, seam)
    const shell = foldPlanes(outer, x, y, z, seam)
    if (cuts.length === 0) return shell
    return smoothMax(cutDistance(x, y, z), shell, seam)
  }

  const surfaceAt = (px: number, py: number, pz: number): { position: Point; normal: Point } => {
    const dx = px - cx
    const dy = py - cy
    const dz = pz - cz
    const along = (t: number) => distance(cx + dx * t, cy + dy * t, cz + dz * t)
    let inside = 0
    let outside = 1
    let insideValue = along(0)
    let outsideValue = along(1)
    for (let step = 1; step < MARCH_STEPS; step++) {
      const t = step / MARCH_STEPS
      const value = along(t)
      if (value >= 0) {
        ;[outside, outsideValue] = [t, value]
        break
      }
      ;[inside, insideValue] = [t, value]
    }
    for (let step = 0; step < BISECTION_STEPS; step++) {
      const middle = (inside + outside) / 2
      const value = along(middle)
      if (value < 0) [inside, insideValue] = [middle, value]
      else [outside, outsideValue] = [middle, value]
    }
    let t = (inside + outside) / 2
    let kept = 0
    for (let step = 0; step < SECANT_STEPS && outsideValue !== insideValue; step++) {
      t = inside - (insideValue * (outside - inside)) / (outsideValue - insideValue)
      const value = along(t)
      if (Math.abs(value) < SURFACE_TOLERANCE) break
      if (value < 0) {
        ;[inside, insideValue] = [t, value]
        if (kept === -1) outsideValue /= 2
        kept = -1
      } else {
        ;[outside, outsideValue] = [t, value]
        if (kept === 1) insideValue /= 2
        kept = 1
      }
    }
    const x = cx + dx * t
    const y = cy + dy * t
    const z = cz + dz * t
    const gx = distance(x + GRADIENT_STEP, y, z) - distance(x - GRADIENT_STEP, y, z)
    const gy = distance(x, y + GRADIENT_STEP, z) - distance(x, y - GRADIENT_STEP, z)
    const gz = distance(x, y, z + GRADIENT_STEP) - distance(x, y, z - GRADIENT_STEP)
    const length = Math.hypot(gx, gy, gz) || 1
    return { position: [x, y, z], normal: [gx / length, gy / length, gz / length] }
  }

  const rows = style.segments
  const reach = Array.from({ length: rows + 1 }, (_, row) => Math.sin((Math.PI / 2) * (row / rows)))
  return faces.map((face) => {
    const [mx, my, mz] = faceCenter(face.points) as [number, number, number]
    const positions: Point[] = []
    const normals: Point[] = []
    const indices: number[] = []
    face.points.forEach((from, index) => {
      const to = face.points[(index + 1) % face.points.length]!
      const base = positions.length
      for (let row = 0; row <= rows; row++) {
        const r = reach[row]!
        for (let column = 0; column <= rows; column++) {
          const s = column / rows
          const ax = from[0]! + (to[0]! - from[0]!) * s
          const ay = from[1]! + (to[1]! - from[1]!) * s
          const az = from[2]! + (to[2]! - from[2]!) * s
          const { position, normal } = surfaceAt(mx + (ax - mx) * r, my + (ay - my) * r, mz + (az - mz) * r)
          positions.push(position)
          normals.push(normal)
        }
      }
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < rows; column++) {
          const a = base + row * (rows + 1) + column
          const b = a + rows + 1
          indices.push(a, b, b + 1, a, b + 1, a + 1)
        }
      }
    })
    return { positions, normals, indices }
  })
}

export const outwardNormal = (points: readonly Point[], center: Point): Point => {
  let normal: Point = [0, 0, 0]
  for (let i = 0; i < points.length; i++) normal = add(normal, cross(points[i]!, points[(i + 1) % points.length]!))
  normal = normalize(normal)
  return dot(normal, subtract(faceCenter(points), center)) < 0 ? scale(normal, -1) : normal
}
