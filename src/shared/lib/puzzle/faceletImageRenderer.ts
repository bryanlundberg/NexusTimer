import type { FaceletPermutation, FaceletState, FaceletStickering, PuzzleDefinition } from '@nexustimer/cubelet'
import { FaceletSvgRenderer, type FaceletLayout, type FaceletPalette } from '@nexustimer/cubelet/svg'
import type { PuzzleImageRenderer, PuzzleImageView } from '@/shared/lib/puzzle/puzzleImageRenderer'

interface FaceletImageOptions<TTurn> {
  readonly definition: PuzzleDefinition<FaceletPermutation<TTurn>, FaceletState<TTurn>>
  readonly palette: () => FaceletPalette
  readonly views: Partial<Record<PuzzleImageView, () => FaceletLayout>>
  readonly stickering?: (preset: string) => FaceletStickering | null
}

export function faceletImageRenderer<TTurn>({
  definition,
  palette,
  views,
  stickering
}: FaceletImageOptions<TTurn>): PuzzleImageRenderer {
  let renderer: FaceletSvgRenderer | undefined
  return (alg, view, preset) => {
    const layout = views[view]
    if (!layout) return null
    try {
      renderer ??= new FaceletSvgRenderer(palette())
      const state = definition.solved().apply(definition.compile(alg))
      return renderer.render(state, layout(), stickering?.(preset) ?? null)
    } catch {
      return null
    }
  }
}
