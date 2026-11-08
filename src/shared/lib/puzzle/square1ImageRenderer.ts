import { square1 } from '@nexustimer/cubelet/square1'
import { FaceletSvgRenderer, square1Image, type FaceletPalette, type Square1View } from '@nexustimer/cubelet/svg'
import type { PuzzleImageRenderer, PuzzleImageView } from '@/shared/lib/puzzle/puzzleImageRenderer'

const VIEWS: Readonly<Record<PuzzleImageView, Square1View>> = {
  net: 'net',
  'last-layer': 'top'
}

export function square1ImageRenderer(palette: () => FaceletPalette): PuzzleImageRenderer {
  let renderer: FaceletSvgRenderer | undefined
  return (alg, view) => {
    try {
      renderer ??= new FaceletSvgRenderer(palette())
      const { source, layout } = square1Image(square1.solved().apply(square1.compile(alg)), VIEWS[view])
      return renderer.render(source, layout)
    } catch {
      return null
    }
  }
}
