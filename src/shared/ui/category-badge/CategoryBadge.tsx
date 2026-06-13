import { Badge } from '@/components/ui/badge'
import { cn } from '@/shared/lib/utils'
import { cubeColorClass } from '@/shared/const/cube-colors'

interface CategoryBadgeProps {
  category: string
  className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <Badge variant="outline" className={cn('gap-1.5 font-mono', className)}>
      <span className={cn('size-2 rounded-[3px] shrink-0', cubeColorClass(category))} aria-hidden />
      {category}
    </Badge>
  )
}
