import type { FaceletStickering } from '../puzzle/facelet-source'
import { cube } from '../nxn/cube-definition'
import type { CubeState } from '../nxn/cube-state'
import type { StickerPermutation } from '../nxn/sticker-permutation'
import { CubeCamera, type CubeCameraOptions } from './cube-camera'
import type { ActiveTurn, CubeFrameRenderer } from './cube-frame'
import { cubeMesh, STICKERLESS_CUBIE_STYLE, VERTICES_PER_HINT, type CubieStyle } from './cube-mesh'
import { animationFrameScheduler, type FrameScheduler } from './frame-scheduler'
import type { GlCubePalette } from './gl-palette'
import type { Quaternion } from './mat4'
import { hintColors, stickerColors, type HintColors } from './sticker-colors'

const TURN_MS = 500
const MAX_PIXEL_RATIO = 2
const OUTLINE_ALPHA = 0.18

export interface CubeViewOptions {
  readonly size: number
  readonly canvas: HTMLCanvasElement
  readonly renderer: CubeFrameRenderer
  readonly palette: GlCubePalette
  readonly style?: CubieStyle
  readonly stickering?: FaceletStickering | null
  readonly scheduler?: FrameScheduler
  readonly camera?: CubeCameraOptions
  readonly tempoScale?: number
  readonly ambient?: number
  readonly outlineAlpha?: number
  readonly hintFacelets?: boolean
}

interface RunningTurn {
  readonly move: StickerPermutation
  readonly start: number
  readonly duration: number
}

const ease = (progress: number) => progress * progress * (3 - 2 * progress)

export class CubeView {
  readonly camera: CubeCamera
  tempoScale: number
  #state: CubeState
  #palette: GlCubePalette
  #stickering: FaceletStickering | null
  #colors: Float32Array | null = null
  #hints: HintColors | null = null
  #queue: StickerPermutation[] = []
  #running: RunningTurn | null = null
  #frame: number | null = null
  #disposed = false
  readonly #scheduler: FrameScheduler

  constructor(private readonly options: CubeViewOptions) {
    this.camera = new CubeCamera(options.camera)
    this.tempoScale = options.tempoScale ?? 1
    this.#state = cube(options.size).solved()
    this.#palette = options.palette
    this.#stickering = options.stickering ?? null
    this.#scheduler = options.scheduler ?? animationFrameScheduler
  }

  get state(): CubeState {
    return this.#state
  }

  get animating(): boolean {
    return this.#running !== null || this.#queue.length > 0
  }

  show(alg: string): void {
    this.#queue = []
    this.#running = null
    this.#setState(cube(this.options.size).solved().apply(cube(this.options.size).compile(alg)))
  }

  play(alg: string): void {
    const moves = cube(this.options.size).compile(alg)
    const pending = this.#running ? [this.#running.move, ...this.#queue] : this.#queue
    if (pending.length > 0) {
      this.#state = this.#state.apply(pending)
      this.#colors = null
    }
    this.#running = null
    this.#queue = [...moves]
    this.invalidate()
  }

  finish(): void {
    const pending = this.#running ? [this.#running.move, ...this.#queue] : this.#queue
    this.#queue = []
    this.#running = null
    this.#setState(this.#state.apply(pending))
  }

  setPalette(palette: GlCubePalette): void {
    this.#palette = palette
    this.#colors = null
    this.invalidate()
  }

  setStickering(stickering: FaceletStickering | null): void {
    this.#stickering = stickering
    this.#colors = null
    this.invalidate()
  }

  setOrientation(orientation: Quaternion): void {
    this.camera.orientation = orientation
    this.invalidate()
  }

  rotateCamera(deltaLongitude: number, deltaLatitude: number): void {
    this.camera.rotate(deltaLongitude, deltaLatitude)
    this.invalidate()
  }

  invalidate(): void {
    if (this.#disposed || this.#frame !== null) return
    this.#frame = this.#scheduler.request((now) => {
      this.#frame = null
      this.#tick(now)
    })
  }

  dispose(): void {
    this.#disposed = true
    if (this.#frame !== null) this.#scheduler.cancel(this.#frame)
    this.#frame = null
  }

  #setState(state: CubeState): void {
    this.#state = state
    this.#colors = null
    this.invalidate()
  }

  #duration(move: StickerPermutation): number {
    return move.turn.quarterTurns === 0 ? 0 : TURN_MS / this.tempoScale
  }

  #advance(now: number): void {
    for (;;) {
      if (!this.#running) {
        const move = this.#queue.shift()
        if (!move) return
        this.#running = { move, start: now, duration: this.#duration(move) }
      }
      const { move, start, duration } = this.#running
      if (duration > 0 && now - start < duration) return
      this.#state = this.#state.apply([move])
      this.#colors = null
      this.#running = null
    }
  }

  #activeTurn(now: number): ActiveTurn | null {
    if (!this.#running) return null
    const { move, start, duration } = this.#running
    const { axis, from, to, animationQuarterTurns } = move.turn
    const angle = animationQuarterTurns * (Math.PI / 2) * ease(Math.min(1, (now - start) / duration))
    return { axis, from, to, angle }
  }

  #tick(now: number): void {
    if (this.#disposed) return
    this.#advance(now)
    this.#render(now)
    if (this.animating) this.invalidate()
  }

  #render(now: number): void {
    const { canvas } = this.options
    const ratio = Math.min(globalThis.devicePixelRatio ?? 1, MAX_PIXEL_RATIO)
    const width = Math.round(canvas.clientWidth * ratio)
    const height = Math.round(canvas.clientHeight * ratio)
    if (width === 0 || height === 0) return
    if (this.#colors === null) this.#hints = null

    const style = this.options.style ?? STICKERLESS_CUBIE_STYLE
    this.#colors ??= stickerColors(
      this.#state,
      this.#palette,
      this.#stickering,
      cubeMesh(this.options.size, style).verticesPerSticker
    )
    if (this.options.hintFacelets) {
      this.#hints ??= hintColors(this.#state, this.#palette, this.#stickering, VERTICES_PER_HINT)
    }
    this.options.renderer.render(canvas, {
      size: this.options.size,
      style,
      width,
      height,
      projection: this.camera.projection(width / height),
      view: this.camera.view(),
      stickerColors: this.#colors,
      bodyColor: this.#palette.body,
      ambient: this.options.ambient ?? 1,
      outlineAlpha: this.options.outlineAlpha ?? OUTLINE_ALPHA,
      hints: this.options.hintFacelets ? this.#hints : null,
      turn: this.#activeTurn(now)
    })
  }
}
