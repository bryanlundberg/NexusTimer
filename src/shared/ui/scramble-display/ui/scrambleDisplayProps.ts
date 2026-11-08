import type React from 'react'
import type { CubeCategory } from '@/shared/const/cube-categories'
import type { PuzzleId } from '@/shared/types/puzzleViz'

export interface ScrambleDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  show: boolean
  scramble: string | null
  event: CubeCategory
  visualization?: '2D' | '3D'
  puzzle?: PuzzleId
}
