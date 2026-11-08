import { renderPuzzleImage } from '@/shared/lib/puzzle/puzzleImages'
import { cubeSizeOf, renderCubeImage } from '@/shared/lib/puzzle/renderCubeImage'

export function renderScrambleImage(puzzle: string, scramble: string): string | null {
  const size = cubeSizeOf(puzzle)
  if (size) return renderCubeImage({ size, alg: scramble, view: 'net' })
  return renderPuzzleImage(puzzle, scramble, 'net')
}
