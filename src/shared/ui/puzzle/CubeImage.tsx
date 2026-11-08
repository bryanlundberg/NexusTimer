import type React from 'react'
import { cn } from '@/shared/lib/utils'

interface CubeImageProps extends React.HTMLAttributes<HTMLDivElement> {
  svg: string
}

export default function CubeImage({ svg, className, ...rest }: CubeImageProps) {
  return (
    <div
      {...rest}
      className={cn('[&>svg]:block [&>svg]:size-full', className)}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
