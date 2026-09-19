import { cn } from '@/shared/lib/utils'
import { formatBadgeCount } from '@/shared/lib/badge-count'

interface Props extends React.ComponentProps<'span'> {
  count: number
}

export function CountBadge({ count, className, ...props }: Props) {
  if (count <= 0) return null

  return (
    <span
      className={cn(
        'inline-flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-cube-red px-1 text-[10px] leading-none font-bold text-white tabular-nums ring-2 ring-background',
        className
      )}
      {...props}
    >
      {formatBadgeCount(count)}
    </span>
  )
}
