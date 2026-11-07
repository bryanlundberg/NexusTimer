import { cubeStickering } from '@nexustimer/cubelet/nxn'
import {
  CubeDragControl,
  CubeView,
  WebGlCubeRenderer,
  resolveGlPalette,
  type GlCubePalette,
  type Quaternion
} from '@nexustimer/cubelet/webgl'
import type { Cube3dRequest } from '@/shared/lib/puzzle/cube3dRequest'
import { NEXUS_GL_CUBE_PALETTE } from '@/shared/lib/puzzle/nexusGlCubePalette'

const TWISTY_DISTANCE_SCALE = 7.9 / 6

export interface Cube3dOptions {
  readonly dragInput: boolean
  readonly tempoScale?: number
  readonly cameraDistance?: number
  readonly hintFacelets?: boolean
  readonly ownContext?: boolean
}

export interface Cube3dHandle {
  readonly animating: boolean
  show(request: Cube3dRequest): void
  play(alg: string): void
  finish(): void
  setTempoScale(scale: number): void
  setOrientation(orientation: Quaternion): void
  resize(): void
  dispose(): void
}

let renderer: WebGlCubeRenderer | null | undefined
let palette: { readonly theme: string; readonly value: GlCubePalette } | null = null

const sharedRenderer = (): WebGlCubeRenderer | null => {
  if (renderer === undefined) {
    const shared = new WebGlCubeRenderer()
    renderer = shared.prepare() ? shared : null
  }
  return renderer
}

const ownRenderer = (canvas: HTMLCanvasElement): WebGlCubeRenderer | null => {
  const own = new WebGlCubeRenderer(() => canvas)
  return own.prepare() ? own : null
}

const themePalette = (): GlCubePalette => {
  const theme = document.documentElement.className
  if (palette?.theme !== theme) palette = { theme, value: resolveGlPalette(document.body, NEXUS_GL_CUBE_PALETTE) }
  return palette.value
}

export function mountCube3d(
  canvas: HTMLCanvasElement,
  request: Cube3dRequest,
  { dragInput, tempoScale, cameraDistance, hintFacelets, ownContext = false }: Cube3dOptions
): Cube3dHandle | null {
  const own = ownContext ? ownRenderer(canvas) : null
  const target = own ?? sharedRenderer()
  if (!target) return null

  const view = new CubeView({
    size: request.size,
    canvas,
    renderer: target,
    palette: themePalette(),
    tempoScale,
    hintFacelets,
    camera: cameraDistance === undefined ? undefined : { distance: cameraDistance * TWISTY_DISTANCE_SCALE }
  })
  const drag = dragInput ? new CubeDragControl(canvas, view) : null

  const show = ({ size, alg, stickering, lastLayer }: Cube3dRequest) => {
    view.setStickering(cubeStickering(size, stickering, { lastLayer }))
    try {
      view.show(alg)
    } catch {
      view.show('')
    }
  }
  show(request)

  return {
    get animating() {
      return view.animating
    },
    show,
    play: (alg) => {
      try {
        view.play(alg)
      } catch {}
    },
    finish: () => view.finish(),
    setTempoScale: (scale) => {
      view.tempoScale = scale
    },
    setOrientation: (orientation) => view.setOrientation(orientation),
    resize: () => view.invalidate(),
    dispose: () => {
      drag?.dispose()
      view.dispose()
      own?.dispose()
    }
  }
}
