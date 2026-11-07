import type React from 'react'
import type { TwistyPlayer } from '@rednaxela101/cubing/twisty'

export interface AlgorithmRenderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  width?: number | string
  height?: number | string
  style?: React.CSSProperties
  config?: Partial<TwistyPlayer>
}
