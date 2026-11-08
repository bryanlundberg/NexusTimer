import { clock } from '@nexustimer/cubelet/clock'
import { ClockSvgRenderer, type ClockPalette } from '@nexustimer/cubelet/svg'
import type { PuzzleImageRenderer } from '@/shared/lib/puzzle/puzzleImageRenderer'

export function clockImageRenderer(palette: () => ClockPalette): PuzzleImageRenderer {
  let renderer: ClockSvgRenderer | undefined
  return (alg, view) => {
    if (view !== 'net') return null
    try {
      renderer ??= new ClockSvgRenderer(palette())
      return renderer.render(clock.solved().apply(clock.compile(alg)))
    } catch {
      return null
    }
  }
}
