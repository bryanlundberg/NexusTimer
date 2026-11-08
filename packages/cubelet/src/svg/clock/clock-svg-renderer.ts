import { CLOCK_DIALS_PER_FACE, type ClockState } from '../../clock/clock-state'
import { BoundedCache } from '../../shared/bounded-cache'
import type { ColorMixer } from '../color-mixer'
import type { FaceletPalette } from '../facelet-palette'
import { OUTLINE_WIDTH } from '../sticker-style'

interface ClockSide {
  readonly body: string
  readonly dial: string
  readonly hand: string
}

export interface ClockPalette {
  readonly id: string
  readonly sides: readonly [ClockSide, ClockSide]
  readonly marker: string
  readonly pin: string
  readonly outline: string
}

export function clockPalette(cubePalette: FaceletPalette, mixer: ColorMixer): ClockPalette {
  const [white, red, , , , blue] = cubePalette.colors as [string, string, string, string, string, string]
  return {
    id: `${cubePalette.id}-clock-${mixer.id}`,
    sides: [
      { body: cubePalette.ignored, dial: white, hand: blue },
      { body: mixer.dim(blue), dial: blue, hand: white }
    ],
    marker: red,
    pin: cubePalette.outline,
    outline: cubePalette.outline
  }
}

const DIAL_RADIUS = 1
const SPACING = 2.7
const PADDING = 0.75
const FACE_HALF = SPACING + DIAL_RADIUS + PADDING
const FACE_GAP = 0.9
const CORNER_RADIUS = 1.8
const MARKER_OFFSET = 1.22
const PIN_RADIUS = 0.2
const HAND: ReadonlyArray<readonly [number, number]> = [
  [0, -0.8],
  [0.15, 0],
  [0, 0.24],
  [-0.15, 0]
]

const round = (value: number) => Math.round(value * 1000) / 1000

const handPath = (x: number, y: number, hour: number) => {
  const angle = (hour * Math.PI) / 6
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const points = HAND.map(([px, py]) => `${round(x + px * cos - py * sin)} ${round(y + px * sin + py * cos)}`)
  return `M${points.join('L')}Z`
}

const circle = (x: number, y: number, radius: number, fill: string) =>
  `<circle cx="${round(x)}" cy="${round(y)}" r="${radius}" style="fill:${fill}"/>`

const drawFace = (state: ClockState, face: number, side: ClockSide, palette: ClockPalette, centerX: number) => {
  const centerY = FACE_HALF
  let svg = `<rect x="${round(centerX - FACE_HALF)}" y="0" width="${round(2 * FACE_HALF)}" height="${round(
    2 * FACE_HALF
  )}" rx="${CORNER_RADIUS}" style="fill:${side.body}"/>`
  let hands = ''
  for (let index = 0; index < CLOCK_DIALS_PER_FACE; index++) {
    const x = centerX + ((index % 3) - 1) * SPACING
    const y = centerY + (Math.floor(index / 3) - 1) * SPACING
    svg += circle(x, y, DIAL_RADIUS, side.dial)
    svg += circle(x, y - MARKER_OFFSET, 0.09, palette.marker)
    hands += handPath(x, y, state.dialAt(face * CLOCK_DIALS_PER_FACE + index))
  }
  for (const dx of [-0.5, 0.5]) {
    for (const dy of [-0.5, 0.5]) svg += circle(centerX + dx * SPACING, centerY + dy * SPACING, PIN_RADIUS, palette.pin)
  }
  return `${svg}<path style="fill:${side.hand}" d="${hands}"/>`
}

export class ClockSvgRenderer {
  readonly #cache: BoundedCache<string, string>

  constructor(
    private readonly palette: ClockPalette,
    cacheSize = 128
  ) {
    this.#cache = new BoundedCache(cacheSize)
  }

  render(state: ClockState): string {
    const key = state.key()
    const cached = this.#cache.get(key)
    if (cached !== undefined) return cached
    const [first, second] = this.palette.sides
    const [front, back] = state.flipped ? [second, first] : [first, second]
    const width = 4 * FACE_HALF + FACE_GAP
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(width)} ${round(2 * FACE_HALF)}">` +
      `<g stroke="${this.palette.outline}" stroke-width="${OUTLINE_WIDTH}" stroke-linejoin="round">` +
      drawFace(state, 0, front, this.palette, FACE_HALF) +
      drawFace(state, 1, back, this.palette, 3 * FACE_HALF + FACE_GAP) +
      `</g></svg>`
    this.#cache.set(key, svg)
    return svg
  }
}
