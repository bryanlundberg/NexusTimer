import { FACES, type FaceName } from './faces'

type Vector = [number, number, number]

const placeSticker = (face: FaceName, row: number, col: number, size: number): Vector => {
  const edge = size - 1
  const r = 2 * row - edge
  const c = 2 * col - edge
  switch (face) {
    case 'U':
      return [c, edge, r]
    case 'D':
      return [c, -edge, -r]
    case 'F':
      return [c, -r, edge]
    case 'B':
      return [-c, -r, -edge]
    case 'R':
      return [edge, -r, -c]
    case 'L':
      return [-edge, -r, c]
  }
}

export class CubeGeometry {
  readonly stickersPerFace: number
  readonly stickerCount: number
  readonly positions: Int8Array
  readonly normals: Int8Array
  readonly #indexByKey = new Map<number, number>()

  constructor(readonly size: number) {
    this.stickersPerFace = size * size
    this.stickerCount = 6 * this.stickersPerFace
    this.positions = new Int8Array(this.stickerCount * 3)
    this.normals = new Int8Array(this.stickerCount * 3)

    let index = 0
    for (const face of FACES) {
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const position = placeSticker(face.name, row, col, size)
          this.positions.set(position, index * 3)
          this.normals[index * 3 + face.axis] = face.sign
          this.#indexByKey.set(this.#key(position, this.normals.subarray(index * 3, index * 3 + 3)), index)
          index++
        }
      }
    }
  }

  indexOf(position: ArrayLike<number>, normal: ArrayLike<number>): number {
    const index = this.#indexByKey.get(this.#key(position, normal))
    if (index === undefined) throw new Error('No sticker at that position')
    return index
  }

  #key(position: ArrayLike<number>, normal: ArrayLike<number>): number {
    const span = 2 * this.size
    const offset = this.size
    let key = 0
    for (let axis = 0; axis < 3; axis++) key = key * span + position[axis]! + offset
    for (let axis = 0; axis < 3; axis++) key = key * 3 + normal[axis]! + 1
    return key
  }
}

const geometries = new Map<number, CubeGeometry>()

export function cubeGeometry(size: number): CubeGeometry {
  let geometry = geometries.get(size)
  if (!geometry) {
    geometry = new CubeGeometry(size)
    geometries.set(size, geometry)
  }
  return geometry
}
