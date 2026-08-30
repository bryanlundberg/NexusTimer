import { merge } from 'es-toolkit'
import type { TwistyPlayer } from '@rednaxela101/cubing/twisty'
import { invertAlgorithm } from '@/shared/lib/algorithms/algNotation'

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

const SUPPORTED_PUZZLES = new Set(['2x2x2', '3x3x3', '4x4x4'])

type LooseViz = Partial<TwistyPlayer> & { experimentalStickering?: string; puzzle?: string }

const normalizePuzzle = (puzzle: string): string =>
  puzzle === '2x2' ? '2x2x2' : puzzle === '3x3' ? '3x3x3' : puzzle === 'sq1' ? 'square1' : puzzle

/**
 * The rotation that puts the yellow layer on top for a given puzzle, or `''` for
 * puzzles this module leaves alone (5x5, pyraminx). For renderers that
 * build their own TwistyPlayer instead of going through `applyYellowOrientation`.
 */
export const yellowOrientationSetupAlg = (puzzle: string): string =>
  SUPPORTED_PUZZLES.has(normalizePuzzle(puzzle)) ? 'z2' : ''

/**
 * Turns a case config into the still image the thumbnails show: the case the
 * algorithm solves, so running the algorithm from there finishes the puzzle. That
 * state is `alg⁻¹` applied to a solved puzzle, with `z2` in front on 2x2–4x4 so it
 * sits on the yellow (D) layer instead of the default white (U) one. 4x4 sets use
 * `full` stickering, so they only get the rotation (no mask), and 5x5, pyraminx
 * and square1 are not reoriented at all.
 *
 * The state is inverted here and passed as `experimentalSetupAlg` with an empty
 * `alg`, rather than handed to `experimentalSetupAnchor: 'end'` to invert. With
 * nothing left to animate the player simply displays the setup, so the image no
 * longer depends on where cubing.js parks the playhead: unanchored it only lands
 * on the end of the alg while the setup alg is empty (`setupAnchor === "start" &&
 * setupAlg.isEmpty() ? timeRange.end : timeRange.start`), which is what left every
 * NxN thumbnail on a solved cube once the anchor was dropped.
 *
 * Collections also carry a `setup` field, but it does not always describe the same
 * case as `algs[0]`, so using it here would let the thumbnail drift from the
 * algorithm text.
 */
export const applyYellowOrientation = <T extends object>(config: T): T => {
  const viz = config as LooseViz
  const puzzle = normalizePuzzle(viz.puzzle ?? '3x3x3')
  const oriented = SUPPORTED_PUZZLES.has(puzzle)

  // TwistyPlayer types `alg` as write-only, so it is read back off a loose shape.
  const moves = String((config as { alg?: unknown }).alg ?? '')

  let inverted: string
  try {
    inverted = invertAlgorithm(moves)
  } catch {
    // A case that does not parse keeps its config: better a wrong-looking
    // thumbnail than throwing while the list renders.
    return config
  }

  const patch: Record<string, string> = {
    alg: '',
    experimentalSetupAlg: [oriented ? 'z2' : '', inverted].filter(Boolean).join(' ')
  }

  const mask = oriented ? D_LAYER_MASKS[viz.experimentalStickering ?? '']?.[puzzle] : undefined
  if (mask) patch.experimentalStickeringMaskOrbits = mask

  return merge(merge({}, config), patch) as T
}
