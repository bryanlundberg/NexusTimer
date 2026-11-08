import { WCA_CUBE_PALETTE, type FaceletPalette } from '@nexustimer/cubelet/svg'

const tint = (percent: number) => `color-mix(in oklab, var(--foreground, #e4e4e7) ${percent}%, transparent)`
const FACE_TOKENS = ['white', 'red', 'green', 'yellow', 'orange', 'blue'] as const

const token = (name: string, index: number) => `var(--cube-${name}, ${WCA_CUBE_PALETTE.colors[index]})`

export const NEXUS_CUBE_PALETTE: FaceletPalette = {
  id: 'nexus-cube',
  colors: FACE_TOKENS.map(token),
  dimColors: FACE_TOKENS.map((name, index) => `color-mix(in oklab, ${token(name, index)} 35%, transparent)`),
  ignored: tint(14),
  outline: tint(20)
}
