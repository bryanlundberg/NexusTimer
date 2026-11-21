import type { CaseViz } from '@nexustimer/algorithms'
import { invertAlgorithm } from '@/shared/lib/algorithms/algNotation'
import type { Cube3dRequest } from '@/shared/lib/puzzle/cube3dRequest'
import { renderPuzzleImage } from '@/shared/lib/puzzle/puzzleImages'
import { cubeSizeOf, renderCubeImage } from '@/shared/lib/puzzle/renderCubeImage'

export interface CaseRender {
  readonly puzzle: string
  readonly viz: CaseViz
  readonly alg: string
}

export interface CaseScene {
  readonly request: Cube3dRequest
  readonly dragInput: boolean
}

const YELLOW_TOP_PUZZLES = new Set(['2x2x2', '3x3x3', '4x4x4'])

const PUZZLE_ALIASES: Readonly<Record<string, string>> = { '2x2': '2x2x2', '3x3': '3x3x3', sq1: 'square1' }

const normalizePuzzle = (puzzle: string): string => PUZZLE_ALIASES[puzzle] ?? puzzle

const yellowOnTop = (puzzle: string): boolean => YELLOW_TOP_PUZZLES.has(normalizePuzzle(puzzle))

export const yellowOrientationSetupAlg = (puzzle: string): string => (yellowOnTop(puzzle) ? 'z2' : '')

export const caseLastLayer = (puzzle: string): 'U' | 'D' => (yellowOnTop(puzzle) ? 'D' : 'U')

const caseState = ({ puzzle, alg }: CaseRender): string | null => {
  try {
    return [yellowOrientationSetupAlg(puzzle), invertAlgorithm(alg)].filter(Boolean).join(' ')
  } catch {
    return null
  }
}

export function caseImage(render: CaseRender): string | null {
  const state = caseState(render)
  if (state === null) return null
  const puzzle = normalizePuzzle(render.puzzle)
  const { view, stickering } = render.viz
  const size = cubeSizeOf(puzzle)

  if (size === null) return renderPuzzleImage(puzzle, state, view === '3d' ? 'net' : view, stickering)
  if (view === '3d') return null
  return renderCubeImage({ size, alg: state, view, stickering, lastLayer: caseLastLayer(puzzle) })
}

export function caseCube3d(render: CaseRender): CaseScene | null {
  const size = cubeSizeOf(normalizePuzzle(render.puzzle))
  if (size === null || render.viz.view !== '3d') return null
  const state = caseState(render)
  if (state === null) return null
  return {
    request: {
      size,
      alg: state,
      stickering: render.viz.stickering,
      lastLayer: caseLastLayer(render.puzzle)
    },
    dragInput: render.viz.dragInput ?? false
  }
}
