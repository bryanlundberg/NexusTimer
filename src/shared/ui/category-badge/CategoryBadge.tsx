import { Badge } from '@/components/ui/badge'
import { cn } from '@/shared/lib/utils'
import { CubeColorDot } from '@/shared/ui/category-badge/CubeColorDot'

interface CategoryBadgeProps {
  category: string
  className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'badge-notch h-5 gap-1.5 border-border/60 bg-muted/40 px-1.5 py-0',
        'font-mono text-[10px] font-medium tracking-wide text-muted-foreground',
        className
      )}
    >
      <CubeColorDot category={category} />
      {category}
    </Badge>
  )
}
