import type { Point } from './triangle-grid'
import { cross, dot, normalize, subtract } from './vector'

export interface Plane {
  readonly normal: Point
  readonly distance: number
}

export interface CellFace {
  readonly points: readonly Point[]
  readonly tag: number
}

export type Cell = readonly CellFace[]

export const CUT_FACE = -1

const EPSILON = 1e-9

const side = (point: Point, plane: Plane) => dot(point, plane.normal) - plane.distance

const clip = (points: readonly Point[], plane: Plane, sign: 1 | -1): Point[] => {
  const kept: Point[] = []
  for (let i = 0; i < points.length; i++) {
    const p = points[i]!
    const q = points[(i + 1) % points.length]!
    const sp = sign * side(p, plane)
    const sq = sign * side(q, plane)
    if (sp <= EPSILON) kept.push(p)
    if ((sp < -EPSILON && sq > EPSILON) || (sp > EPSILON && sq < -EPSILON)) {
      const t = sp / (sp - sq)
      kept.push(p.map((value, axis) => value + (q[axis]! - value) * t))
    }
  }
  return kept
}

const uniquePoints = (points: readonly Point[]): Point[] => {
  const unique: Point[] = []
  for (const point of points) {
    if (!unique.some((other) => Math.hypot(...subtract(point, other)) < 1e-7)) unique.push(point)
  }
  return unique
}

const ringAround = (points: readonly Point[], normal: Point): Point[] => {
  const unique = uniquePoints(points)
  const center = unique[0]!.map((_, axis) => unique.reduce((sum, point) => sum + point[axis]!, 0) / unique.length)
  const helper = Math.abs(normal[0]!) < 0.9 ? [1, 0, 0] : [0, 1, 0]
  const u = normalize(cross(normal, helper))
  const v = cross(normal, u)
  const angle = (point: Point) => {
    const offset = subtract(point, center)
    return Math.atan2(dot(offset, v), dot(offset, u))
  }
  return unique.sort((a, b) => angle(a) - angle(b))
}

export function splitCell(cell: Cell, plane: Plane, capTag = CUT_FACE): [Cell | null, Cell | null] {
  let min = Infinity
  let max = -Infinity
  for (const face of cell) {
    for (const point of face.points) {
      const s = side(point, plane)
      min = Math.min(min, s)
      max = Math.max(max, s)
    }
  }
  if (max <= EPSILON) return [cell, null]
  if (min >= -EPSILON) return [null, cell]

  const below: CellFace[] = []
  const above: CellFace[] = []
  const section: Point[] = []
  for (const face of cell) {
    const lower = uniquePoints(clip(face.points, plane, 1))
    const upper = uniquePoints(clip(face.points, plane, -1))
    if (lower.length >= 3) below.push({ points: lower, tag: face.tag })
    if (upper.length >= 3) above.push({ points: upper, tag: face.tag })
    for (const point of lower) if (Math.abs(side(point, plane)) <= EPSILON) section.push(point)
  }
  const cap = ringAround(section, plane.normal)
  if (cap.length >= 3) {
    below.push({ points: cap, tag: capTag })
    above.push({ points: [...cap].reverse(), tag: capTag })
  }
  return [below, above]
}

const box = (half: number): Cell => {
  const corner = (x: number, y: number, z: number): Point => [x * half, y * half, z * half]
  const quads: ReadonlyArray<readonly Point[]> = [
    [corner(1, -1, -1), corner(1, 1, -1), corner(1, 1, 1), corner(1, -1, 1)],
    [corner(-1, -1, -1), corner(-1, -1, 1), corner(-1, 1, 1), corner(-1, 1, -1)],
    [corner(-1, 1, -1), corner(-1, 1, 1), corner(1, 1, 1), corner(1, 1, -1)],
    [corner(-1, -1, -1), corner(1, -1, -1), corner(1, -1, 1), corner(-1, -1, 1)],
    [corner(-1, -1, 1), corner(1, -1, 1), corner(1, 1, 1), corner(-1, 1, 1)],
    [corner(-1, -1, -1), corner(-1, 1, -1), corner(1, 1, -1), corner(1, -1, -1)]
  ]
  return quads.map((points) => ({ points, tag: CUT_FACE }))
}

export function convexPolytope(faces: readonly Plane[]): Cell {
  let cell: Cell = box(10)
  faces.forEach((plane, index) => {
    const [inside] = splitCell(cell, plane, index)
    if (!inside) throw new Error('Empty polytope')
    cell = inside
  })
  return cell
}

export function cutCells(cell: Cell, cuts: readonly Plane[]): Cell[] {
  let cells: Cell[] = [cell]
  for (const plane of cuts) {
    cells = cells.flatMap((current) => splitCell(current, plane).filter((part): part is Cell => part !== null))
  }
  return cells
}
