import type { Cell } from '../../geometry/convex-cells'
import type { Point } from '../../geometry/triangle-grid'
import { add, cross, dot, normalize, scale, subtract } from '../../geometry/vector'
import { moldedSurface, outwardNormal, type FaceRadius, type MoldedStyle } from './molded-piece'

export const BODY_COLOR = -1

export interface PolyMesh {
  readonly positions: Float32Array
  readonly normals: Float32Array
  readonly centers: Float32Array
  readonly colorRefs: Int32Array
  readonly cores: Float32Array
  readonly indices: Uint32Array
  readonly vertexCount: number
  readonly radius: number
}

export interface PolyPiece {
  readonly cell: Cell
  readonly colorOf: (faceIndex: number) => number
  readonly scale?: number
}

const PIECE_SCALE = 0.95
const SAME_PLANE = 0.9999

const newellNormal = (points: readonly Point[]): Point => {
  let normal: Point = [0, 0, 0]
  for (let i = 0; i < points.length; i++) normal = add(normal, cross(points[i]!, points[(i + 1) % points.length]!))
  return normalize(normal)
}

const average = (points: readonly Point[]): Point =>
  scale(
    points.reduce<Point>((sum, point) => add(sum, point), [0, 0, 0]),
    1 / points.length
  )

const outerFaceRadius = (pieces: readonly PolyPiece[]): FaceRadius => {
  const faces: Array<{ normal: Point; radius: number }> = []
  for (const { cell, colorOf } of pieces) {
    const center = average(cell.flatMap((face) => face.points))
    cell.forEach((face, faceIndex) => {
      if (colorOf(faceIndex) === BODY_COLOR) return
      const normal = outwardNormal(face.points, center)
      const radius = Math.max(
        ...face.points.map((point) => Math.hypot(...subtract(point, scale(normal, dot(point, normal)))))
      )
      const known = faces.find((entry) => dot(entry.normal, normal) > SAME_PLANE)
      if (known) known.radius = Math.max(known.radius, radius)
      else faces.push({ normal, radius })
    })
  }
  return (normal) => faces.find((entry) => dot(entry.normal, normal) > SAME_PLANE)?.radius ?? 0
}

export function buildPolyMesh(pieces: readonly PolyPiece[], pieceScale = PIECE_SCALE, molded?: MoldedStyle): PolyMesh {
  const positions: number[] = []
  const normals: number[] = []
  const centers: number[] = []
  const colorRefs: number[] = []
  const cores: number[] = []
  const indices: number[] = []
  let radius = 0
  const faceRadius = molded ? outerFaceRadius(pieces) : () => 0

  for (const piece of pieces) {
    const { cell, colorOf } = piece
    const ownScale = piece.scale ?? (molded ? molded.pieceScale : pieceScale)
    const center = average(cell.flatMap((face) => face.points))
    if (molded) {
      const faces = cell.map((face, faceIndex) => {
        const points = face.points.map((point) => add(center, scale(subtract(point, center), ownScale)))
        return { points, normal: outwardNormal(points, center), outer: colorOf(faceIndex) !== BODY_COLOR }
      })
      moldedSurface(faces, center, molded, faceRadius).forEach((surface, faceIndex) => {
        const color = colorOf(faceIndex)
        const base = positions.length / 3
        surface.positions.forEach((point, vertex) => {
          positions.push(...point)
          normals.push(...surface.normals[vertex]!)
          centers.push(...center)
          colorRefs.push(color)
          cores.push(color === BODY_COLOR ? 1 : 0)
          radius = Math.max(radius, Math.hypot(...point))
        })
        for (const index of surface.indices) indices.push(base + index)
      })
      continue
    }
    cell.forEach((face, faceIndex) => {
      const shrunk = face.points.map((point) => add(center, scale(subtract(point, center), ownScale)))
      let normal = newellNormal(shrunk)
      if (dot(normal, subtract(average(shrunk), center)) < 0) normal = scale(normal, -1)
      const color = colorOf(faceIndex)
      const base = positions.length / 3
      for (const point of shrunk) {
        positions.push(...point)
        normals.push(...normal)
        centers.push(...center)
        colorRefs.push(color)
        cores.push(color === BODY_COLOR ? 1 : 0)
        radius = Math.max(radius, Math.hypot(...point))
      }
      for (let k = 1; k < shrunk.length - 1; k++) indices.push(base, base + k, base + k + 1)
    })
  }

  return {
    positions: Float32Array.from(positions),
    normals: Float32Array.from(normals),
    centers: Float32Array.from(centers),
    colorRefs: Int32Array.from(colorRefs),
    cores: Float32Array.from(cores),
    indices: Uint32Array.from(indices),
    vertexCount: positions.length / 3,
    radius
  }
}
