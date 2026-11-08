import { cube, cubeStickering } from '@nexustimer/cubelet/nxn'
import { FaceletSvgRenderer, cubeLastLayerLayout, cubeNetLayout, type FaceletPalette } from '@nexustimer/cubelet/svg'
import { NEXUS_CUBE_PALETTE } from '@/shared/lib/puzzle/nexusCubePalette'

export type CubeImageView = 'net' | 'last-layer'

export interface CubeImageRequest {
  readonly size: number
  readonly alg: string
  readonly view: CubeImageView
  readonly stickering?: string
  readonly lastLayer?: 'U' | 'D'
}

const CUBE_ID = /^(\d+)x\1x\1$/
const MAX_RENDERED_SIZE = 7

const renderers = new Map<string, FaceletSvgRenderer>()

const rendererFor = (palette: FaceletPalette): FaceletSvgRenderer => {
  let renderer = renderers.get(palette.id)
  if (!renderer) {
    renderer = new FaceletSvgRenderer(palette)
    renderers.set(palette.id, renderer)
  }
  return renderer
}

export const cubeSizeOf = (puzzle: string): number | null => {
  const match = CUBE_ID.exec(puzzle)
  const size = match ? Number(match[1]) : NaN
  return size >= 2 && size <= MAX_RENDERED_SIZE ? size : null
}

export function renderCubeImage(
  request: CubeImageRequest,
  palette: FaceletPalette = NEXUS_CUBE_PALETTE
): string | null {
  const { size, alg, view, stickering = 'full', lastLayer = 'U' } = request
  const mask = cubeStickering(size, stickering, { lastLayer })
  if (!mask) return null
  try {
    const definition = cube(size)
    const state = definition.solved().apply(definition.compile(alg))
    const layout = view === 'net' ? cubeNetLayout(size) : cubeLastLayerLayout(size)
    return rendererFor(palette).render(state, layout, mask)
  } catch {
    return null
  }
}
