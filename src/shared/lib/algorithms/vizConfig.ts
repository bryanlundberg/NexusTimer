import _ from 'lodash'
import type { TwistyPlayer } from 'cubing/twisty'

/**
 * cubing.js hardcodes its built-in OLL/PLL stickerings to the white (U) layer,
 * so last-layer cases always render with a white top. To show them on the
 * conventional yellow (D) layer instead, we override the stickering with a mask
 * on the D-layer orbits and rotate the puzzle with `z2` so yellow faces up.
 * `full`-stickered cubes need no mask (the whole cube is shown) — just `z2`.
 *
 * Mask codes (see cubing.js parseSerializedStickeringMask): D = Dim,
 * O = IgnoreNonPrimary (OLL), P = PermuteNonPrimary (PLL), - = Regular. The
 * D-layer pieces sit at slots 4–7 of EDGES/CORNERS and slot 5 of CENTERS, so
 * each entry mirrors the built-in U-layer stickering onto those D-layer slots.
 *
 * Note: PLL/COLL/ZBLL use `-` (Regular) rather than the built-in `P`
 * (PermuteNonPrimary) on the last-layer pieces. `P` dims the top facelet and
 * only colors the sides; `-` keeps every top sticker highlighted, which is
 * needed to read corner orientation in ZBLL and looks cleaner for PLL.
 */
const D_LAYER_MASKS: Record<string, Record<string, string>> = {
  OLL: {
    '2x2x2': 'CORNERS:DDDDOOOO',
    '3x3x3': 'EDGES:DDDDOOOODDDD,CORNERS:DDDDOOOO,CENTERS:DDDDD-'
  },
  PLL: {
    '3x3x3': 'EDGES:DDDD----DDDD,CORNERS:DDDD----,CENTERS:DDDDD-'
  }
}

const SUPPORTED_PUZZLES = new Set(['2x2x2', '3x3x3', '4x4x4', '5x5x5'])

type LooseViz = Partial<TwistyPlayer> & { experimentalStickering?: string; puzzle?: string }

const normalizePuzzle = (puzzle: string): string => (puzzle === '2x2' ? '2x2x2' : puzzle === '3x3' ? '3x3x3' : puzzle)

/**
 * Orients 2x2–5x5 algorithm cases on the yellow (D) layer instead of the default
 * white (U) layer. 4x4/5x5 sets use `full` stickering, so they only get the `z2`
 * rotation (no mask). Unsupported puzzles are returned unchanged.
 */
export const applyYellowOrientation = <T extends object>(config: T): T => {
  const viz = config as LooseViz
  const puzzle = normalizePuzzle(viz.puzzle ?? '3x3x3')
  if (!SUPPORTED_PUZZLES.has(puzzle)) return config

  const mask = D_LAYER_MASKS[viz.experimentalStickering ?? '']?.[puzzle]
  const patch: Record<string, string> = { experimentalSetupAlg: 'z2' }
  if (mask) patch.experimentalStickeringMaskOrbits = mask

  return _.merge({}, config, patch) as T
}
