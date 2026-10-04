import { Diamond, Grid2x2Icon, Grid2x2Plus, Grid3x3, type LucideIcon, Pentagon, TriangleIcon } from 'lucide-react'
import { ALGORITHM_SET_DEFINITIONS, type AlgorithmSetDefinition } from '@nexustimer/algorithms'

const PUZZLE_ICONS: Record<AlgorithmSetDefinition['puzzle'], LucideIcon> = {
  '2x2x2': Grid2x2Icon,
  '3x3x3': Grid3x3,
  '4x4x4': Grid2x2Plus,
  '5x5x5': Grid2x2Plus,
  pyraminx: TriangleIcon,
  square1: Diamond,
  megaminx: Pentagon
}

export const ALGORITHM_SETS = ALGORITHM_SET_DEFINITIONS.map((set) => ({ ...set, Icon: PUZZLE_ICONS[set.puzzle] }))

export type ALGORITHM_SET = (typeof ALGORITHM_SETS)[number]
