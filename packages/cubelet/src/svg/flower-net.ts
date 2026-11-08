import { centroid, type Point } from '../geometry/triangle-grid'
import { dot, subtract } from '../geometry/vector'
import type { FaceletLayout } from './facelet-layout'
import { insetPolygon } from './inset-polygon'
import { EDGE_PADDING, OUTLINE_WIDTH, STICKER_GAP } from './sticker-style'

export interface FoldedFace {
  readonly vertices: readonly Point[]
  readonly stickers: readonly (readonly Point[])[]
}

export interface Flower {
  readonly center: number
  readonly petals: readonly number[]
  readonly project: (point: Point) => Point
}

export type PlacedFaces = ReadonlyArray<readonly [face: number, stickers: Point[][]]>

const samePoint = (a: Point, b: Point) => Math.hypot(...subtract(a, b)) < 1e-9

const reflectAcross = (point: Point, a: Point, b: Point): Point => {
  const along = subtract(b, a)
  const t = dot(subtract(point, a), along) / dot(along, along)
  return point.map((value, i) => 2 * (a[i]! + along[i]! * t) - value)
}

const planeMapping = (from: readonly [Point, Point, Point], to: readonly [Point, Point, Point]) => {
  const [origin, first, second] = from
  const u = subtract(first, origin)
  const v = subtract(second, origin)
  const uu = dot(u, u)
  const uv = dot(u, v)
  const vv = dot(v, v)
  const determinant = uu * vv - uv * uv
  const [o2, f2, s2] = to
  return (point: Point): Point => {
    const w = subtract(point, origin)
    const wu = dot(w, u)
    const wv = dot(w, v)
    const s = (vv * wu - uv * wv) / determinant
    const t = (uu * wv - uv * wu) / determinant
    return o2.map((value, i) => value + s * (f2[i]! - value) + t * (s2[i]! - value))
  }
}

const otherNeighbor = (vertices: readonly Point[], of: Point, away: Point): Point => {
  const index = vertices.findIndex((vertex) => samePoint(vertex, of))
  const before = vertices[(index + vertices.length - 1) % vertices.length]!
  return samePoint(before, away) ? vertices[(index + 1) % vertices.length]! : before
}

const unfoldPetal = (center: FoldedFace, petal: FoldedFace, project: Flower['project']) => {
  const [a, b] = petal.vertices.filter((vertex) => center.vertices.some((other) => samePoint(vertex, other))) as [
    Point,
    Point
  ]
  const a2 = project(a)
  const b2 = project(b)
  const mirrored = reflectAcross(project(otherNeighbor(center.vertices, a, b)), a2, b2)
  return planeMapping([a, b, otherNeighbor(petal.vertices, a, b)], [a2, b2, mirrored])
}

export const shift =
  (offset: Point) =>
  (point: Point): Point =>
    point.map((value, i) => value + offset[i]!)

const outward = (from: Point, to: Point, distance: number): Point => {
  const direction = subtract(to, from)
  const length = Math.hypot(...direction)
  return direction.map((value) => (value / length) * distance)
}

export const bounds = (points: readonly Point[]) => {
  const xs = points.map((point) => point[0]!)
  const ys = points.map((point) => point[1]!)
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) }
}

export function unfoldFlower(faces: readonly FoldedFace[], flower: Flower, petalGap: number): PlacedFaces {
  const center = faces[flower.center]!
  const middle = flower.project(centroid(center.vertices))
  const placed: Array<readonly [number, (point: Point) => Point]> = [[flower.center, flower.project]]
  for (const petal of flower.petals) {
    const toNet = unfoldPetal(center, faces[petal]!, flower.project)
    const gap = shift(outward(middle, toNet(centroid(faces[petal]!.vertices)), petalGap))
    placed.push([petal, (point) => gap(toNet(point))])
  }
  return placed.map(([face, toNet]) => [face, faces[face]!.stickers.map((sticker) => sticker.map(toNet))] as const)
}

export function sideBySide(flowers: readonly PlacedFaces[], faceCount: number, gap: number): Point[][][] {
  const shapes: Point[][][] = Array.from({ length: faceCount }, () => [])
  let offsetX = 0
  for (const flower of flowers) {
    const { minX } = bounds(flower.flatMap(([, stickers]) => stickers.flat()))
    const move = shift([offsetX - minX, 0])
    for (const [face, stickers] of flower) shapes[face] = stickers.map((sticker) => sticker.map(move))
    offsetX = bounds(shapes.flat(2)).maxX + gap
  }
  return shapes
}

export function polygonLayout(id: string, shapes: ReadonlyArray<Point[] | null>): FaceletLayout {
  const { minX, maxX, minY, maxY } = bounds(shapes.flatMap((shape) => shape ?? []))
  const origin = shift([EDGE_PADDING - minX, EDGE_PADDING - minY])
  return {
    id,
    viewBox: [0, 0, maxX - minX + 2 * EDGE_PADDING, maxY - minY + 2 * EDGE_PADDING],
    outlineWidth: OUTLINE_WIDTH,
    shapes: shapes.map((shape) => (shape ? insetPolygon(shape.map(origin), STICKER_GAP) : null))
  }
}
