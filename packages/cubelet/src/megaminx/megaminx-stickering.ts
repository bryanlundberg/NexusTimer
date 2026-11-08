import { dot } from '../geometry/vector'
import { Appearance, type FaceletStickering } from '../puzzle/facelet-source'
import { maskStickering } from '../puzzle/mask-stickering'
import { MEGAMINX_FACES, MEGAMINX_STICKERS_PER_FACE, megaminxCentroids, megaminxLayerCut } from './megaminx-geometry'

export const MEGAMINX_STICKERING_PRESETS = ['full', 'OLL-EO', 'OLL-CO', 'PLL-EO', 'PLL-CP'] as const

export type MegaminxStickeringPreset = (typeof MEGAMINX_STICKERING_PRESETS)[number]

type PieceKind = 'center' | 'edge' | 'corner'

interface StickerFacts {
  readonly kind: PieceKind
  readonly lastLayer: boolean
  readonly facesUp: boolean
}

const U = 0

const kindOf = (sticker: number): PieceKind => {
  const index = sticker % MEGAMINX_STICKERS_PER_FACE
  if (index === 0) return 'center'
  return index % 2 === 1 ? 'edge' : 'corner'
}

const factsOf = (sticker: number): StickerFacts => ({
  kind: kindOf(sticker),
  lastLayer: dot(megaminxCentroids().at(sticker), MEGAMINX_FACES[U]!.normal) > megaminxLayerCut,
  facesUp: Math.floor(sticker / MEGAMINX_STICKERS_PER_FACE) === U
})

const lastLayerRule =
  (shows: (facts: StickerFacts) => boolean) =>
  (facts: StickerFacts): Appearance => {
    if (!facts.lastLayer) return Appearance.Dim
    if (facts.kind === 'center') return Appearance.Regular
    return shows(facts) ? Appearance.Regular : Appearance.Ignored
  }

const RULES: Readonly<Record<MegaminxStickeringPreset, (facts: StickerFacts) => Appearance>> = {
  full: () => Appearance.Regular,
  'OLL-EO': lastLayerRule(({ kind, facesUp }) => kind === 'edge' && facesUp),
  'OLL-CO': lastLayerRule(({ facesUp }) => facesUp),
  'PLL-EO': lastLayerRule(({ kind }) => kind === 'edge'),
  'PLL-CP': lastLayerRule(() => true)
}

const isPreset = (value: string): value is MegaminxStickeringPreset =>
  (MEGAMINX_STICKERING_PRESETS as readonly string[]).includes(value)

const stickerings = new Map<string, FaceletStickering>()

export function megaminxStickering(preset: string): FaceletStickering | null {
  if (!isPreset(preset)) return null
  let stickering = stickerings.get(preset)
  if (!stickering) {
    const rule = RULES[preset]
    stickering = maskStickering(`megaminx:${preset}`, MEGAMINX_FACES.length * MEGAMINX_STICKERS_PER_FACE, (sticker) =>
      rule(factsOf(sticker))
    )
    stickerings.set(preset, stickering)
  }
  return stickering
}
