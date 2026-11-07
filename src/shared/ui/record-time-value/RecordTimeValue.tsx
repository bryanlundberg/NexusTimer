import { cn } from '@/shared/lib/utils'

interface RecordTimeValueProps {
  value: string
  size?: 'sm' | 'lg'
}

export function RecordTimeValue({ value, size = 'sm' }: RecordTimeValueProps) {
  const [main, decimal] = value !== '--' && value.includes('.') ? value.split('.') : [value, null]
  const mainClass = size === 'lg' ? 'text-xl' : 'text-sm'
  const decimalClass = size === 'lg' ? 'text-sm' : 'text-xs'

  if (value === '--') {
    return <span className={cn(mainClass, 'font-bold text-muted-foreground')}>--</span>
  }

  return (
    <span className="flex items-baseline gap-0.5">
      <span className={cn(mainClass, 'font-bold tabular-nums')}>{main}</span>
      {decimal && <span className={cn(decimalClass, 'text-muted-foreground tabular-nums')}>.{decimal}</span>}
    </span>
  )
}
