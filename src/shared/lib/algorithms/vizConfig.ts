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
 * The mask is indexed by piece *identity*, not by slot (see
 * Cube3D.setStickeringMask), so a masked piece keeps its stickering wherever the
 * algorithm moves it. That is what makes the `z2` flip work: the D-layer pieces
 * are the ones that end up on top, and they carry the mask with them.
 *
 * PLL/COLL/ZBLL use `-` (Regular) rather than the built-in `P`
 * (PermuteNonPrimary) on the last-layer pieces. `P` dims the top facelet and
 * only colors the sides; `-` keeps every top sticker highlighted, which is
 * needed to read corner orientation in ZBLL and looks cleaner for PLL.
 *
 * `F2L` greys the D-layer out with `I` (Ignored) instead of highlighting it —
 * post-flip those are the yellow last-layer pieces, which are irrelevant while
 * solving F2L. `D` (Dim) would keep each sticker's own hue, which reads as
 * meaningful; the flat grey leaves only the F2L pieces carrying color.
 */
const D_LAYER_MASKS: Record<string, Record<string, string>> = {
  OLL: {
    '2x2x2': 'CORNERS:DDDDOOOO',
    '3x3x3': 'EDGES:DDDDOOOODDDD,CORNERS:DDDDOOOO,CENTERS:DDDDD-'
  },
  PLL: {
    '3x3x3': 'EDGES:DDDD----DDDD,CORNERS:DDDD----,CENTERS:DDDDD-'
  },
  F2L: {
    '3x3x3': 'EDGES:----IIII----,CORNERS:----IIII,CENTERS:-----I'
  }
}

const SUPPORTED_PUZZLES = new Set(['2x2x2', '3x3x3', '4x4x4', '5x5x5'])

type LooseViz = Partial<TwistyPlayer> & { experimentalStickering?: string; puzzle?: string }

const normalizePuzzle = (puzzle: string): string => (puzzle === '2x2' ? '2x2x2' : puzzle === '3x3' ? '3x3x3' : puzzle)

/**
 * The rotation that puts the yellow layer on top for a given puzzle, or `''` for
 * puzzles this module leaves alone (pyraminx has no `z2`). For renderers that
 * build their own TwistyPlayer instead of going through `applyYellowOrientation`.
 */
export const yellowOrientationSetupAlg = (puzzle: string): string =>
  SUPPORTED_PUZZLES.has(normalizePuzzle(puzzle)) ? 'z2' : ''

/**
 * Orients 2x2–5x5 algorithm cases on the yellow (D) layer instead of the default
 * white (U) layer. 4x4/5x5 sets use `full` stickering, so they only get the `z2`
 * rotation (no mask). Unsupported puzzles are returned unchanged.
 *
 * Callers pair this with `experimentalSetupAnchor: 'end'`, which makes cubing.js
 * derive the start state as `z2 · alg⁻¹`, so the rendered case is always the
 * inverse of the algorithm printed next to it. Collections also carry a `setup`
 * field, but it does not always describe the same case as `algs[0]`, so using it
 * here would let the thumbnail drift from the algorithm text.
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
