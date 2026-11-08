import type { PuzzleImageView } from '@/shared/lib/puzzle/puzzleImageRenderer'
import { renderPuzzleImage } from '@/shared/lib/puzzle/puzzleImages'

interface TwistyPuzzleConfig {
  puzzle?: unknown
  visualization?: unknown
  alg?: unknown
  experimentalSetupAlg?: unknown
  experimentalStickering?: unknown
}

const VIEW_BY_VISUALIZATION: Readonly<Record<string, PuzzleImageView>> = {
  '2D': 'net',
  '3D': 'net',
  'experimental-2D-LL': 'last-layer'
}

export function twistyConfigToPuzzleImage(config: object | undefined): string | null {
  const twisty = (config ?? {}) as TwistyPuzzleConfig
  const view = VIEW_BY_VISUALIZATION[String(twisty.visualization ?? '')]
  if (!view || String(twisty.alg ?? '').trim() !== '') return null
  return renderPuzzleImage(
    String(twisty.puzzle ?? ''),
    String(twisty.experimentalSetupAlg ?? ''),
    view,
    String(twisty.experimentalStickering ?? 'full')
  )
}
