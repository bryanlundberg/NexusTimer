import { cubeGeometry } from '../nxn/cube-geometry'
import { beveledCubie, faceKey, type BeveledCubie } from './beveled-cubie'
import { cubieOcclusion } from './cube-occlusion'
import { speedcubeCubie } from './speedcube-cubie'

export interface CubieStyle {
  readonly halfWidth: number
  readonly pieceScale: number
  readonly outerAxisRadius: number
  readonly innerEdgeRadius: number
  readonly innerCornerRadius: number
  readonly cornerSharpness: number
  readonly segments: number
  readonly capDepth?: number
  readonly moldedBlend?: number
  readonly centerCornerRadius?: number
  readonly edgeCornerRadius?: number
}

export const STICKERLESS_CUBIE_STYLE: CubieStyle = {
  halfWidth: 0.54,
  pieceScale: 0.95,
  outerAxisRadius: 0.004,
  innerEdgeRadius: 0.07,
  innerCornerRadius: 0.34,
  cornerSharpness: 1.3,
  segments: 3
}

export const STUDIO_CUBIE_STYLE: CubieStyle = {
  ...STICKERLESS_CUBIE_STYLE,
  segments: 6
}

export const SPEEDCUBE_CUBIE_STYLE: CubieStyle = {
  halfWidth: 0.52,
  pieceScale: 0.95,
  outerAxisRadius: 0.06,
  innerEdgeRadius: 0.06,
  innerCornerRadius: 0.2,
  cornerSharpness: 1,
  segments: 12,
  capDepth: 0.07,
  moldedBlend: 0.05,
  centerCornerRadius: 0.42,
  edgeCornerRadius: 0.4
}

export const SPEEDCUBE_2X2_CUBIE_STYLE: CubieStyle = {
  ...SPEEDCUBE_CUBIE_STYLE,
  halfWidth: 0.51,
  innerCornerRadius: 0.27
}

export interface MeshPart {
  readonly positions: Float32Array
  readonly slots: Float32Array
  readonly normals: Float32Array
  readonly occlusion: Float32Array
  readonly indices: Uint32Array
  readonly vertexCount: number
  readonly stickerOf?: Int32Array
}

export interface CubeMesh {
  readonly size: number
  readonly verticesPerSticker: number
  readonly extent: number
  readonly pieceHalfSize: number
  readonly capDepth: number
  readonly stickers: MeshPart
  readonly body: MeshPart
  readonly hints: MeshPart
}

export const VERTICES_PER_HINT = 4

const SLOT_WIDTH = 2
const HINT_ELEVATION = 0.5
const HINT_SCALE = 0.85
const HINT_CORNERS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1]
]

interface ShadedCubie {
  readonly cubie: BeveledCubie
  readonly occlusion: Float32Array
}

class PartBuilder {
  readonly #positions: number[] = []
  readonly #slots: number[] = []
  readonly #normals: number[] = []
  readonly #occlusion: number[] = []
  readonly #indices: number[] = []
  readonly #stickerOf: number[] = []

  addFace(
    { cubie, occlusion }: ShadedCubie,
    face: number,
    slot: ArrayLike<number>,
    stickerAt?: (local: ArrayLike<number>) => number
  ): void {
    const base = this.#positions.length / 3
    const start = cubie.faces[face]!.vertexStart
    for (let vertex = start; vertex < start + cubie.verticesPerFace; vertex++) {
      this.#occlusion.push(occlusion[vertex]!)
      if (stickerAt) this.#stickerOf.push(stickerAt(cubie.positions.subarray(vertex * 3, vertex * 3 + 3)))
      for (let k = 0; k < 3; k++) {
        this.#positions.push(cubie.positions[vertex * 3 + k]! + slot[k]!)
        this.#normals.push(cubie.normals[vertex * 3 + k]!)
        this.#slots.push(slot[k]!)
      }
    }
    for (const index of cubie.faceIndexPattern) this.#indices.push(base + index)
  }

  addQuad(axis: number, sign: number, slot: ArrayLike<number>, distance: number, half: number): void {
    const base = this.#positions.length / 3
    const u = (axis + 1) % 3
    const v = (axis + 2) % 3
    for (const [du, dv] of HINT_CORNERS) {
      const point = [slot[0]!, slot[1]!, slot[2]!]
      point[axis]! += sign * distance
      point[u]! += du * half
      point[v]! += dv * sign * half
      this.#positions.push(...point)
      this.#slots.push(slot[0]!, slot[1]!, slot[2]!)
      this.#normals.push(axis === 0 ? sign : 0, axis === 1 ? sign : 0, axis === 2 ? sign : 0)
      this.#occlusion.push(1)
    }
    this.#indices.push(base, base + 1, base + 2, base, base + 2, base + 3)
  }

  build(): MeshPart {
    return {
      positions: Float32Array.from(this.#positions),
      slots: Float32Array.from(this.#slots),
      normals: Float32Array.from(this.#normals),
      occlusion: Float32Array.from(this.#occlusion),
      indices: Uint32Array.from(this.#indices),
      vertexCount: this.#positions.length / 3,
      ...(this.#stickerOf.length > 0 ? { stickerOf: Int32Array.from(this.#stickerOf) } : {})
    }
  }
}

const meshes = new Map<string, CubeMesh>()

const styleKey = (style: CubieStyle) => Object.values(style).join(':')

const buildCubeMesh = (size: number, style: CubieStyle): CubeMesh => {
  const edge = size - 1
  const scale = style.pieceScale * SLOT_WIDTH
  const shape = {
    halfSize: style.halfWidth * scale,
    outerAxisRadius: style.outerAxisRadius * scale,
    innerEdgeRadius: style.innerEdgeRadius * scale,
    innerCornerRadius: style.innerCornerRadius * scale,
    cornerSharpness: style.cornerSharpness,
    segments: style.segments
  }
  const isOutward = (slot: ArrayLike<number>) => (axis: number, sign: 1 | -1) => slot[axis] === sign * edge
  const cubies = new Map<string, ShadedCubie>()
  const cubieAt = (slot: ArrayLike<number>): ShadedCubie => {
    const outward = isOutward(slot)
    const key = [0, 1, 2].map((axis) => `${+outward(axis, 1)}${+outward(axis, -1)}`).join('')
    let shaded = cubies.get(key)
    if (!shaded) {
      const cubie =
        style.moldedBlend === undefined
          ? beveledCubie(shape, outward)
          : speedcubeCubie(
              {
                halfSize: shape.halfSize,
                tileRadius: shape.innerCornerRadius,
                centerRadius: (style.centerCornerRadius ?? style.innerCornerRadius) * scale,
                edgeRadius: (style.edgeCornerRadius ?? style.innerCornerRadius) * scale,
                seamRadius: shape.innerEdgeRadius,
                outerRadius: shape.outerAxisRadius,
                blend: style.moldedBlend * scale,
                segments: style.segments
              },
              outward
            )
      shaded = { cubie, occlusion: cubieOcclusion(cubie, shape.halfSize, outward) }
      cubies.set(key, shaded)
    }
    return shaded
  }

  const geometry = cubeGeometry(size)
  const stickerKey = (slot: ArrayLike<number>, axis: number, sign: number) =>
    `${slot[0]},${slot[1]},${slot[2]},${axis},${sign}`
  const stickerIndex = new Map<string, number>()
  const nearestSticker = (slot: ArrayLike<number>) => (local: ArrayLike<number>) => {
    let best = -1
    let bestReach = -Infinity
    for (let axis = 0; axis < 3; axis++) {
      if (Math.abs(slot[axis]!) !== edge) continue
      const sign = Math.sign(slot[axis]!)
      const reach = sign * local[axis]!
      if (reach > bestReach) {
        bestReach = reach
        best = stickerIndex.get(stickerKey(slot, axis, sign))!
      }
    }
    return best
  }
  const stickers = new PartBuilder()
  const hints = new PartBuilder()
  for (let sticker = 0; sticker < geometry.stickerCount; sticker++) {
    const slot = geometry.positions.subarray(sticker * 3, sticker * 3 + 3)
    const normal = geometry.normals.subarray(sticker * 3, sticker * 3 + 3)
    const axis = normal[0] ? 0 : normal[1] ? 1 : 2
    stickerIndex.set(stickerKey(slot, axis, normal[axis]!), sticker)
    stickers.addFace(cubieAt(slot), faceKey(axis, normal[axis]!), slot)
    hints.addQuad(axis, normal[axis]!, slot, (SLOT_WIDTH / 2) * (1 + 2 * HINT_ELEVATION), (HINT_SCALE * SLOT_WIDTH) / 2)
  }

  const body = new PartBuilder()
  for (let x = -edge; x <= edge; x += 2) {
    for (let y = -edge; y <= edge; y += 2) {
      for (let z = -edge; z <= edge; z += 2) {
        const slot = [x, y, z]
        if (Math.max(Math.abs(x), Math.abs(y), Math.abs(z)) !== edge) continue
        const shaded = cubieAt(slot)
        const outward = isOutward(slot)
        shaded.cubie.faces.forEach((face, index) => {
          if (outward(face.axis, face.sign)) return
          body.addFace(shaded, index, slot, style.capDepth === undefined ? undefined : nearestSticker(slot))
        })
      }
    }
  }

  return {
    size,
    verticesPerSticker: cubieAt([edge, edge, edge]).cubie.verticesPerFace,
    extent: edge + shape.halfSize,
    pieceHalfSize: shape.halfSize,
    capDepth: (style.capDepth ?? 0) * scale,
    stickers: stickers.build(),
    body: body.build(),
    hints: hints.build()
  }
}

export function cubeMesh(size: number, style: CubieStyle = STICKERLESS_CUBIE_STYLE): CubeMesh {
  const key = `${size}:${styleKey(style)}`
  let mesh = meshes.get(key)
  if (!mesh) {
    mesh = buildCubeMesh(size, style)
    meshes.set(key, mesh)
  }
  return mesh
}
