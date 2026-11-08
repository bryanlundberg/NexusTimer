import { Appearance, type FaceletStickering } from '../puzzle/facelet-source'
import { cubePieces, type CubePieces } from './cube-pieces'
import { FACE_BY_NAME, type Face, type FaceName } from './faces'

export const CUBE_STICKERING_PRESETS = ['full', 'OLL', 'OLL-F2L', 'PLL', 'F2L', 'L2E', 'centers-only'] as const

export type CubeStickeringPreset = (typeof CUBE_STICKERING_PRESETS)[number]

export interface CubeStickeringOptions {
  readonly lastLayer?: 'U' | 'D'
}

interface StickerFacts {
  readonly pieces: CubePieces
  readonly lastLayer: Face
}

const isCubeStickeringPreset = (value: string): value is CubeStickeringPreset =>
  (CUBE_STICKERING_PRESETS as readonly string[]).includes(value)

const outerCoordinate = (pieces: CubePieces, face: Face) => face.sign * (pieces.geometry.size - 1)

const inLastLayer = ({ pieces, lastLayer }: StickerFacts, sticker: number) =>
  pieces.coordinate(sticker, lastLayer.axis) === outerCoordinate(pieces, lastLayer)

const facesLastLayer = ({ pieces, lastLayer }: StickerFacts, sticker: number) =>
  pieces.normal(sticker, lastLayer.axis) === lastLayer.sign

const touchesFace = (pieces: CubePieces, sticker: number, face: FaceName) =>
  pieces.coordinate(sticker, FACE_BY_NAME[face].axis) === outerCoordinate(pieces, FACE_BY_NAME[face])

type Rule = (facts: StickerFacts, sticker: number) => Appearance

const oll: Rule = (facts, sticker) => {
  if (!inLastLayer(facts, sticker)) return Appearance.Dim
  if (facts.pieces.kindOf(sticker) === 'center') return Appearance.Regular
  return facesLastLayer(facts, sticker) ? Appearance.Regular : Appearance.Ignored
}

const RULES: Readonly<Record<CubeStickeringPreset, Rule>> = {
  full: () => Appearance.Regular,
  OLL: oll,
  'OLL-F2L': (facts, sticker) => (inLastLayer(facts, sticker) ? oll(facts, sticker) : Appearance.Regular),
  PLL: (facts, sticker) => (inLastLayer(facts, sticker) ? Appearance.Regular : Appearance.Dim),
  F2L: (facts, sticker) => (inLastLayer(facts, sticker) ? Appearance.Ignored : Appearance.Regular),
  L2E: (facts, sticker) => {
    const { pieces } = facts
    const keep =
      pieces.kindOf(sticker) === 'edge' &&
      inLastLayer(facts, sticker) &&
      (touchesFace(pieces, sticker, 'F') || touchesFace(pieces, sticker, 'B'))
    return keep ? Appearance.Regular : Appearance.Ignored
  },
  'centers-only': (facts, sticker) =>
    facts.pieces.kindOf(sticker) === 'center' ? Appearance.Regular : Appearance.Ignored
}

class MaskStickering implements FaceletStickering {
  constructor(
    readonly id: string,
    private readonly appearances: Uint8Array
  ) {}

  appearanceOf(sticker: number): Appearance {
    return this.appearances[sticker] as Appearance
  }
}

const stickerings = new Map<string, FaceletStickering>()

export function cubeStickering(
  size: number,
  preset: string,
  { lastLayer = 'U' }: CubeStickeringOptions = {}
): FaceletStickering | null {
  if (!isCubeStickeringPreset(preset)) return null
  const id = `${size}:${preset}:${lastLayer}`
  let stickering = stickerings.get(id)
  if (!stickering) {
    const pieces = cubePieces(size)
    const facts: StickerFacts = { pieces, lastLayer: FACE_BY_NAME[lastLayer] }
    const rule = RULES[preset]
    const appearances = new Uint8Array(pieces.geometry.stickerCount)
    for (let sticker = 0; sticker < appearances.length; sticker++) appearances[sticker] = rule(facts, sticker)
    stickering = new MaskStickering(id, appearances)
    stickerings.set(id, stickering)
  }
  return stickering
}
