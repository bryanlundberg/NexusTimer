import type { TurnMotion } from '../../geometry/axis-turn-system'
import type { PuzzleState } from '../../puzzle/puzzle-definition'
import { CubeCamera, type CubeCameraOptions } from '../cube-camera'
import { animationFrameScheduler, type FrameScheduler } from '../frame-scheduler'
import type { GlCubePalette } from '../gl-palette'
import { BODY_COLOR, type PolyMesh } from './poly-mesh'
import type { PuzzleModel3d } from './puzzle-model'
import type { WebGlPolyRenderer } from './webgl-poly-renderer'

const TURN_MS = 500
const MAX_PIXEL_RATIO = 2
const TARGET_RADIUS = 1.75

export interface PuzzleViewOptions<TMove, TState extends PuzzleState<TMove>> {
  readonly model: PuzzleModel3d<TMove, TState>
  readonly canvas: HTMLCanvasElement
  readonly renderer: WebGlPolyRenderer
  readonly palette: GlCubePalette
  readonly scheduler?: FrameScheduler
  readonly camera?: CubeCameraOptions
  readonly tempoScale?: number
  readonly ambient?: number
}

interface RunningMove<TMove> {
  readonly move: TMove
  readonly motions: readonly TurnMotion[]
  readonly start: number
  readonly duration: number
}

const ease = (progress: number) => progress * progress * (3 - 2 * progress)

export class PuzzleView<TMove, TState extends PuzzleState<TMove>> {
  readonly camera: CubeCamera
  tempoScale: number
  #state: TState
  #mesh: PolyMesh | null = null
  #colors: Float32Array | null = null
  #queue: TMove[] = []
  #running: RunningMove<TMove> | null = null
  #frame: number | null = null
  #disposed = false
  readonly #scale: number
  readonly #scheduler: FrameScheduler

  constructor(private readonly options: PuzzleViewOptions<TMove, TState>) {
    this.camera = new CubeCamera(options.camera)
    this.tempoScale = options.tempoScale ?? 1
    this.#state = options.model.definition.solved()
    this.#scheduler = options.scheduler ?? animationFrameScheduler
    this.#scale = TARGET_RADIUS / options.model.mesh(this.#state).radius
  }

  get state(): TState {
    return this.#state
  }

  get animating(): boolean {
    return this.#running !== null || this.#queue.length > 0
  }

  show(alg: string): void {
    const { definition } = this.options.model
    this.#queue = []
    this.#running = null
    this.#setState(definition.solved().apply(definition.compile(alg)) as TState)
  }

  play(alg: string): void {
    const moves = this.options.model.definition.compile(alg)
    const pending = this.#pending()
    if (pending.length > 0) this.#setState(this.#state.apply(pending) as TState)
    this.#running = null
    this.#queue = [...moves]
    this.invalidate()
  }

  finish(): void {
    const pending = this.#pending()
    this.#queue = []
    this.#running = null
    this.#setState(this.#state.apply(pending) as TState)
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

  #pending(): TMove[] {
    return this.#running ? [this.#running.move, ...this.#queue] : [...this.#queue]
  }

  #setState(state: TState): void {
    this.#state = state
    this.#mesh = null
    this.#colors = null
    this.invalidate()
  }

  #advance(now: number): void {
    for (;;) {
      if (!this.#running) {
        const move = this.#queue.shift()
        if (move === undefined) return
        const motions = this.options.model.motions(move)
        this.#running = { move, motions, start: now, duration: motions.length ? TURN_MS / this.tempoScale : 0 }
      }
      const { move, start, duration } = this.#running
      if (duration > 0 && now - start < duration) return
      this.#setState(this.#state.apply([move]) as TState)
      this.#running = null
    }
  }

  #activeMotions(now: number): readonly TurnMotion[] {
    if (!this.#running) return []
    const { motions, start, duration } = this.#running
    const progress = ease(Math.min(1, (now - start) / duration))
    return motions.map((motion) => ({ ...motion, angle: motion.angle * progress }))
  }

  #tick(now: number): void {
    if (this.#disposed) return
    this.#advance(now)
    this.#render(now)
    if (this.animating) this.invalidate()
  }

  #paint(mesh: PolyMesh): Float32Array {
    const { model, palette } = this.options
    const colors = new Float32Array(mesh.vertexCount * 3)
    for (let vertex = 0; vertex < mesh.vertexCount; vertex++) {
      const ref = mesh.colorRefs[vertex]!
      const [r, g, b] = ref === BODY_COLOR ? palette.body : model.colorOf(this.#state, ref, palette)
      colors[vertex * 3] = r
      colors[vertex * 3 + 1] = g
      colors[vertex * 3 + 2] = b
    }
    return colors
  }

  #render(now: number): void {
    const { canvas, renderer, model } = this.options
    const ratio = Math.min(globalThis.devicePixelRatio ?? 1, MAX_PIXEL_RATIO)
    const width = Math.round(canvas.clientWidth * ratio)
    const height = Math.round(canvas.clientHeight * ratio)
    if (width === 0 || height === 0) return
    this.#mesh ??= model.mesh(this.#state)
    this.#colors ??= this.#paint(this.#mesh)
    renderer.render({
      width,
      height,
      projection: this.camera.projection(width / height),
      view: this.camera.view(),
      scale: this.#scale,
      ambient: this.options.ambient ?? 0.7,
      mesh: this.#mesh,
      colors: this.#colors,
      motions: this.#activeMotions(now)
    })
  }
}
