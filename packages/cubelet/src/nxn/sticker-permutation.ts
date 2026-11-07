import type { CubeGeometry } from './cube-geometry'
import type { LayerTurn } from './layer-turn'

export interface StickerPermutation {
  readonly turn: LayerTurn
  readonly targets: Uint16Array
  readonly sources: Uint16Array
}

const rotateQuarter = (vector: Int8Array, axis: number): void => {
  const a = (axis + 1) % 3
  const b = (axis + 2) % 3
  const nextA = -vector[b]!
  vector[b] = vector[a]!
  vector[a] = nextA
}

export function buildStickerPermutation(geometry: CubeGeometry, turn: LayerTurn): StickerPermutation {
  const targets: number[] = []
  const sources: number[] = []
  if (turn.quarterTurns === 0) return { turn, targets: new Uint16Array(0), sources: new Uint16Array(0) }

  const position = new Int8Array(3)
  const normal = new Int8Array(3)
  for (let sticker = 0; sticker < geometry.stickerCount; sticker++) {
    const offset = sticker * 3
    const layer = geometry.positions[offset + turn.axis]!
    if (layer < turn.from || layer > turn.to) continue

    position.set(geometry.positions.subarray(offset, offset + 3))
    normal.set(geometry.normals.subarray(offset, offset + 3))
    for (let turns = 0; turns < turn.quarterTurns; turns++) {
      rotateQuarter(position, turn.axis)
      rotateQuarter(normal, turn.axis)
    }
    targets.push(geometry.indexOf(position, normal))
    sources.push(sticker)
  }
  return { turn, targets: Uint16Array.from(targets), sources: Uint16Array.from(sources) }
}
