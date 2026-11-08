import type { FaceletPalette } from './facelet-palette'

export interface ColorMixer {
  readonly id: string
  light(color: string): string
  dark(color: string): string
  blend(first: string, second: string): string
  dim(color: string): string
}

export interface CubeColors {
  readonly white: string
  readonly red: string
  readonly green: string
  readonly yellow: string
  readonly orange: string
  readonly blue: string
}

export function derivedPalette(
  puzzle: string,
  cubePalette: FaceletPalette,
  mixer: ColorMixer,
  faceColors: (cube: CubeColors, mixer: ColorMixer) => readonly string[]
): FaceletPalette {
  const [white, red, green, yellow, orange, blue] = cubePalette.colors as [
    string,
    string,
    string,
    string,
    string,
    string
  ]
  const colors = faceColors({ white, red, green, yellow, orange, blue }, mixer)
  return {
    ...cubePalette,
    id: `${cubePalette.id}-${puzzle}-${mixer.id}`,
    colors,
    dimColors: colors.map((color) => mixer.dim(color))
  }
}

const channels = (hex: string) => [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16))

const toHex = (values: readonly number[]) =>
  `#${values.map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`

const mixHex = (first: string, second: string, weight: number) => {
  const a = channels(first)
  const b = channels(second)
  return toHex(a.map((value, i) => value * weight + b[i]! * (1 - weight)))
}

export const HEX_COLOR_MIXER: ColorMixer = {
  id: 'hex',
  light: (color) => mixHex(color, '#ffffff', 0.55),
  dark: (color) => mixHex(color, '#27272a', 0.55),
  blend: (first, second) => mixHex(first, second, 0.5),
  dim: (color) => mixHex(color, '#18181b', 0.45)
}
