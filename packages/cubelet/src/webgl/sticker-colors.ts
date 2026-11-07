import type { FaceletSource, FaceletStickering } from '../puzzle/facelet-source'
import { Appearance } from '../puzzle/facelet-source'
import type { Rgb } from './cube-frame'
import type { GlCubePalette } from './gl-palette'

const colorOf = (
  source: FaceletSource,
  position: number,
  palette: GlCubePalette,
  stickering: FaceletStickering | null
): Rgb => {
  const appearance = stickering?.appearanceOf(source.stickerAt(position)) ?? Appearance.Regular
  if (appearance === Appearance.Ignored) return palette.ignored
  const color = source.colorAt(position)
  return (appearance === Appearance.Dim ? palette.dimColors : palette.colors)[color]!
}

export function stickerColors(
  source: FaceletSource,
  palette: GlCubePalette,
  stickering: FaceletStickering | null,
  verticesPerSticker: number
): Float32Array {
  const colors = new Float32Array(source.stickerCount * verticesPerSticker * 3)
  for (let position = 0; position < source.stickerCount; position++) {
    const [r, g, b] = colorOf(source, position, palette, stickering)
    const base = position * verticesPerSticker * 3
    for (let vertex = 0; vertex < verticesPerSticker; vertex++) {
      colors[base + vertex * 3] = r
      colors[base + vertex * 3 + 1] = g
      colors[base + vertex * 3 + 2] = b
    }
  }
  return colors
}

const HINT_OPACITY = 0.5
const HINT_FACE_OPACITY: readonly number[] = [1.25, 1, 1, 1.25, 1, 0.75]
const HINT_IGNORED_OPACITY = 0.75

export interface HintColors {
  readonly colors: Float32Array
  readonly alphas: Float32Array
}

export function hintColors(
  source: FaceletSource,
  palette: GlCubePalette,
  stickering: FaceletStickering | null,
  verticesPerHint: number
): HintColors {
  const colors = new Float32Array(source.stickerCount * verticesPerHint * 3)
  const alphas = new Float32Array(source.stickerCount * verticesPerHint)
  const perFace = source.stickerCount / 6
  for (let position = 0; position < source.stickerCount; position++) {
    const ignored = stickering?.appearanceOf(source.stickerAt(position)) === Appearance.Ignored
    const [r, g, b] = colorOf(source, position, palette, stickering)
    const alpha = ignored ? HINT_IGNORED_OPACITY : HINT_OPACITY * HINT_FACE_OPACITY[Math.floor(position / perFace)]!
    for (let vertex = 0; vertex < verticesPerHint; vertex++) {
      const index = position * verticesPerHint + vertex
      colors[index * 3] = r
      colors[index * 3 + 1] = g
      colors[index * 3 + 2] = b
      alphas[index] = alpha
    }
  }
  return { colors, alphas }
}
