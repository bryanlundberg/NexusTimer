import type React from 'react'
import type { PuzzleVizConfig } from '@/shared/types/puzzleViz'

export interface AlgorithmRenderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  width?: number | string
  height?: number | string
  style?: React.CSSProperties
  config?: PuzzleVizConfig
}
