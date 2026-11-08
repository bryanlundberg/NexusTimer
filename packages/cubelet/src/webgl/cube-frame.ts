import type { CubieStyle } from './cube-mesh'
import type { Mat4 } from './mat4'
import type { HintColors } from './sticker-colors'

export type Rgb = readonly [r: number, g: number, b: number]

export interface ActiveTurn {
  readonly axis: number
  readonly from: number
  readonly to: number
  readonly angle: number
}

export interface CubeFrame {
  readonly size: number
  readonly style: CubieStyle
  readonly width: number
  readonly height: number
  readonly projection: Mat4
  readonly view: Mat4
  readonly stickerColors: Float32Array
  readonly bodyColor: Rgb
  readonly ambient: number
  readonly outlineAlpha: number
  readonly hints: HintColors | null
  readonly turn: ActiveTurn | null
}

export interface CubeFrameRenderer {
  render(target: HTMLCanvasElement, frame: CubeFrame): void
}
