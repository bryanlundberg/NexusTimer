import type React from 'react'
import type { PuzzleID } from '@rednaxela101/cubing/twisty'
import type { CubeCategory } from '@/shared/const/cube-categories'

export interface ScrambleDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  show: boolean
  scramble: string | null
  event: CubeCategory
  visualization?: '2D' | '3D'
  puzzle?: PuzzleID
}
