import type { PuzzleState } from '@nexustimer/cubelet'
import type { FaceletPalette } from '@nexustimer/cubelet/svg'
import { CubeDragControl, resolveGlPalette } from '@nexustimer/cubelet/webgl'
import {
  PuzzleView,
  WebGlPolyRenderer,
  megaminxModel3d,
  pyraminxModel3d,
  square1Model3d,
  type PuzzleModel3d,
  type PuzzleViewOptions
} from '@nexustimer/cubelet/webgl/poly'
import { NEXUS_GL_CUBE_PALETTE } from '@/shared/lib/puzzle/nexusGlCubePalette'
import {
  NEXUS_MEGAMINX_PALETTE,
  NEXUS_PYRAMINX_PALETTE,
  NEXUS_SQUARE1_PALETTE
} from '@/shared/lib/puzzle/nexusPuzzlePalettes'

export interface Puzzle3dHandle {
  show(alg: string): void
  play(alg: string): void
  setTempoScale(scale: number): void
  resize(): void
  dispose(): void
}

interface AnimatedView {
  tempoScale: number
  show(alg: string): void
  play(alg: string): void
  invalidate(): void
  rotateCamera(deltaLongitude: number, deltaLatitude: number): void
  dispose(): void
}

type ViewSettings = Omit<PuzzleViewOptions<unknown, PuzzleState<unknown>>, 'model'>

interface Puzzle3dSource {
  readonly palette: FaceletPalette
  readonly create: (settings: ViewSettings) => AnimatedView
}

const source = <TMove, TState extends PuzzleState<TMove>>(
  model: PuzzleModel3d<TMove, TState>,
  palette: FaceletPalette
): Puzzle3dSource => ({ palette, create: (settings) => new PuzzleView({ ...settings, model }) })

const SOURCES: Readonly<Record<string, Puzzle3dSource>> = {
  pyraminx: source(pyraminxModel3d, NEXUS_PYRAMINX_PALETTE),
  megaminx: source(megaminxModel3d, NEXUS_MEGAMINX_PALETTE),
  square1: source(square1Model3d, NEXUS_SQUARE1_PALETTE)
}

export function mountPuzzle3d(
  canvas: HTMLCanvasElement,
  puzzle: string,
  alg: string,
  { tempoScale }: { readonly tempoScale?: number } = {}
): Puzzle3dHandle | null {
  const entry = SOURCES[puzzle]
  if (!entry) return null
  const renderer = WebGlPolyRenderer.create(canvas)
  if (!renderer) return null

  const { colors, dimColors, ignored } = entry.palette
  const view = entry.create({
    canvas,
    renderer,
    palette: resolveGlPalette(document.body, { colors, dimColors, ignored, body: NEXUS_GL_CUBE_PALETTE.body }),
    tempoScale
  })
  const drag = new CubeDragControl(canvas, view)
  const guard = (action: () => void) => {
    try {
      action()
    } catch {}
  }
  guard(() => view.show(alg))
  view.invalidate()

  return {
    show: (next) => guard(() => view.show(next)),
    play: (move) => guard(() => view.play(move)),
    setTempoScale: (scale) => {
      view.tempoScale = scale
    },
    resize: () => view.invalidate(),
    dispose: () => {
      drag.dispose()
      view.dispose()
      renderer.dispose()
    }
  }
}
