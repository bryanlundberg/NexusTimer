import { cubeGeometry, type CubeGeometry } from './cube-geometry'

export type PieceKind = 'corner' | 'edge' | 'center'

const KIND_BY_STICKER_COUNT: Readonly<Record<number, PieceKind>> = { 1: 'center', 2: 'edge', 3: 'corner' }

export class CubePieces {
  readonly pieceOf: Uint16Array
  readonly kinds: readonly PieceKind[]

  constructor(readonly geometry: CubeGeometry) {
    this.pieceOf = new Uint16Array(geometry.stickerCount)
    const pieceByPosition = new Map<string, number>()
    const sizes: number[] = []
    for (let sticker = 0; sticker < geometry.stickerCount; sticker++) {
      const key = geometry.positions.subarray(sticker * 3, sticker * 3 + 3).join(',')
      let piece = pieceByPosition.get(key)
      if (piece === undefined) {
        piece = sizes.length
        pieceByPosition.set(key, piece)
        sizes.push(0)
      }
      this.pieceOf[sticker] = piece
      sizes[piece]!++
    }
    this.kinds = sizes.map((size) => KIND_BY_STICKER_COUNT[size]!)
  }

  kindOf(sticker: number): PieceKind {
    return this.kinds[this.pieceOf[sticker]!]!
  }

  coordinate(sticker: number, axis: number): number {
    return this.geometry.positions[sticker * 3 + axis]!
  }

  normal(sticker: number, axis: number): number {
    return this.geometry.normals[sticker * 3 + axis]!
  }
}

const piecesBySize = new Map<number, CubePieces>()

export function cubePieces(size: number): CubePieces {
  let pieces = piecesBySize.get(size)
  if (!pieces) {
    pieces = new CubePieces(cubeGeometry(size))
    piecesBySize.set(size, pieces)
  }
  return pieces
}
