import { cn } from '@/shared/lib/utils'
import { cubeColorClass } from '@/shared/const/cube-colors'

interface CubeColorDotProps {
  category: string
  className?: string
}

export function CubeColorDot({ category, className }: CubeColorDotProps) {
  return <span className={cn('size-1.5 shrink-0 rounded-[2px]', cubeColorClass(category), className)} aria-hidden />
}
