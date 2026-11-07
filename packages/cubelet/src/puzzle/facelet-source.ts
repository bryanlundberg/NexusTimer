export interface FaceletSource {
  readonly stickerCount: number
  stickerAt(position: number): number
  colorAt(position: number): number
  key(): string
}

export const Appearance = {
  Regular: 0,
  Dim: 1,
  Ignored: 2
} as const

export type Appearance = (typeof Appearance)[keyof typeof Appearance]

export interface FaceletStickering {
  readonly id: string
  appearanceOf(sticker: number): Appearance
}
