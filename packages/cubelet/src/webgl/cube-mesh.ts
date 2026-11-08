import { cubeGeometry } from '../nxn/cube-geometry'
import { beveledCubie, faceKey, type BeveledCubie } from './beveled-cubie'

export interface CubieStyle {
  readonly halfWidth: number
  readonly pieceScale: number
  readonly outerAxisRadius: number
  readonly innerEdgeRadius: number
  readonly innerCornerRadius: number
  readonly cornerSharpness: number
  readonly segments: number
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

export interface MeshPart {
  readonly positions: Float32Array
  readonly slots: Float32Array
  readonly normals: Float32Array
  readonly indices: Uint32Array
  readonly vertexCount: number
}

export interface CubeMesh {
  readonly size: number
  readonly verticesPerSticker: number
  readonly extent: number
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

class PartBuilder {
  readonly #positions: number[] = []
  readonly #slots: number[] = []
  readonly #normals: number[] = []
  readonly #indices: number[] = []

  addFace(cubie: BeveledCubie, face: number, slot: ArrayLike<number>): void {
    const base = this.#positions.length / 3
    const start = cubie.faces[face]!.vertexStart
    for (let vertex = start; vertex < start + cubie.verticesPerFace; vertex++) {
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
    }
    this.#indices.push(base, base + 1, base + 2, base, base + 2, base + 3)
  }

  build(): MeshPart {
    return {
      positions: Float32Array.from(this.#positions),
      slots: Float32Array.from(this.#slots),
      normals: Float32Array.from(this.#normals),
      indices: Uint32Array.from(this.#indices),
      vertexCount: this.#positions.length / 3
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
  const cubies = new Map<string, BeveledCubie>()
  const cubieAt = (slot: ArrayLike<number>): BeveledCubie => {
    const outward = isOutward(slot)
    const key = [0, 1, 2].map((axis) => `${+outward(axis, 1)}${+outward(axis, -1)}`).join('')
    let cubie = cubies.get(key)
    if (!cubie) {
      cubie = beveledCubie(shape, outward)
      cubies.set(key, cubie)
    }
    return cubie
  }

  const geometry = cubeGeometry(size)
  const stickers = new PartBuilder()
  const hints = new PartBuilder()
  for (let sticker = 0; sticker < geometry.stickerCount; sticker++) {
    const slot = geometry.positions.subarray(sticker * 3, sticker * 3 + 3)
    const normal = geometry.normals.subarray(sticker * 3, sticker * 3 + 3)
    const axis = normal[0] ? 0 : normal[1] ? 1 : 2
    stickers.addFace(cubieAt(slot), faceKey(axis, normal[axis]!), slot)
    hints.addQuad(axis, normal[axis]!, slot, (SLOT_WIDTH / 2) * (1 + 2 * HINT_ELEVATION), (HINT_SCALE * SLOT_WIDTH) / 2)
  }

  const body = new PartBuilder()
  for (let x = -edge; x <= edge; x += 2) {
    for (let y = -edge; y <= edge; y += 2) {
      for (let z = -edge; z <= edge; z += 2) {
        const slot = [x, y, z]
        if (Math.max(Math.abs(x), Math.abs(y), Math.abs(z)) !== edge) continue
        const cubie = cubieAt(slot)
        const outward = isOutward(slot)
        cubie.faces.forEach((face, index) => {
          if (!outward(face.axis, face.sign)) body.addFace(cubie, index, slot)
        })
      }
    }
  }

  return {
    size,
    verticesPerSticker: cubieAt([edge, edge, edge]).verticesPerFace,
    extent: edge + shape.halfSize,
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
