import { stickerCentroids, type StickerCentroids } from '../geometry/rotation-permutation'
import { centroid, type Point } from '../geometry/triangle-grid'
import { add, cross, dot, lerp, normalize, planesMeet, scale, subtract } from '../geometry/vector'

export type MegaminxFaceName = 'U' | 'F' | 'R' | 'BR' | 'BL' | 'L' | 'D' | 'B' | 'DL' | 'FL' | 'FR' | 'DR'

export const MEGAMINX_FACE_NAMES: readonly MegaminxFaceName[] = [
  'U',
  'F',
  'R',
  'BR',
  'BL',
  'L',
  'D',
  'B',
  'DL',
  'FL',
  'FR',
  'DR'
]

export interface MegaminxFace {
  readonly name: MegaminxFaceName
  readonly normal: Point
  readonly neighbors: readonly number[]
  readonly vertices: readonly Point[]
  readonly stickers: readonly (readonly Point[])[]
}

const PLANE_DISTANCE = 1
const CENTER_SCALE = 0.5
const RING_COS = 1 / Math.sqrt(5)
const RING_SIN = 2 / Math.sqrt(5)
const NEIGHBOR_DOT = 0.4
const U = 0
const F = 1
const D = 6
const B = 7

const upperRing = (index: number): Point => {
  const azimuth = (index * 2 * Math.PI) / 5
  return [RING_SIN * Math.sin(azimuth), RING_COS, RING_SIN * Math.cos(azimuth)]
}

const NORMALS: readonly Point[] = (() => {
  const upper = [[0, 1, 0], ...[0, 1, 2, 3, 4].map(upperRing)]
  return [...upper, ...upper.map((normal) => scale(normal, -1))]
})()

const referenceFace = (face: number): number => (face === U ? F : face === D ? B : U)

const sortedNeighbors = (face: number): number[] => {
  const normal = NORMALS[face]!
  const inPlane = (vector: Point) => normalize(subtract(vector, scale(normal, dot(vector, normal))))
  const first = inPlane(NORMALS[referenceFace(face)]!)
  const second = cross(normal, first)
  const angleOf = (other: number) => {
    const direction = inPlane(NORMALS[other]!)
    const angle = Math.atan2(dot(direction, second), dot(direction, first))
    return angle < -1e-9 ? angle + 2 * Math.PI : angle
  }
  return NORMALS.map((_, other) => other)
    .filter((other) => other !== face && dot(NORMALS[other]!, normal) > NEIGHBOR_DOT)
    .sort((a, b) => angleOf(a) - angleOf(b))
}

const buildFace = (face: number): MegaminxFace => {
  const normal = NORMALS[face]!
  const neighbors = sortedNeighbors(face)
  const vertices = neighbors.map((neighbor, i) =>
    planesMeet([normal, NORMALS[neighbor]!, NORMALS[neighbors[(i + 1) % 5]!]!], PLANE_DISTANCE)
  )
  const center = scale(normal, PLANE_DISTANCE)
  const inner = vertices.map((vertex) => lerp(center, vertex, CENTER_SCALE))
  const edgeLength = Math.hypot(...subtract(vertices[1]!, vertices[0]!))
  const apothem = Math.hypot(...subtract(lerp(vertices[0]!, vertices[1]!, 0.5), center))
  const along = (apothem * (1 - CENTER_SCALE)) / Math.sin((3 * Math.PI) / 5) / edgeLength

  const stickers: Point[][] = [inner]
  for (let i = 0; i < 5; i++) {
    const previous = vertices[(i + 4) % 5]!
    const vertex = vertices[i]!
    const next = vertices[(i + 1) % 5]!
    stickers.push([lerp(previous, vertex, along), lerp(vertex, previous, along), inner[i]!, inner[(i + 4) % 5]!])
    stickers.push([vertex, lerp(vertex, next, along), inner[i]!, lerp(vertex, previous, along)])
  }
  return { name: MEGAMINX_FACE_NAMES[face]!, normal, neighbors, vertices, stickers }
}

export const MEGAMINX_FACES: readonly MegaminxFace[] = NORMALS.map((_, face) => buildFace(face))

export const MEGAMINX_STICKERS_PER_FACE = 11

export const megaminxLayerCut: number = (() => {
  const { vertices, normal, neighbors } = MEGAMINX_FACES[U]!
  const neighbor = MEGAMINX_FACES[neighbors[0]!]!
  const sharedMidpoint = lerp(vertices[4]!, vertices[0]!, 0.5)
  const towardCenter = normalize(subtract(scale(neighbor.normal, PLANE_DISTANCE), sharedMidpoint))
  const apothem = Math.hypot(...subtract(sharedMidpoint, scale(neighbor.normal, PLANE_DISTANCE)))
  return dot(add(sharedMidpoint, scale(towardCenter, apothem * (1 - CENTER_SCALE))), normal)
})()

let centroids: StickerCentroids | undefined

export function megaminxCentroids(): StickerCentroids {
  centroids ??= stickerCentroids(MEGAMINX_FACES.flatMap((face) => face.stickers.map((sticker) => centroid(sticker))))
  return centroids
}
