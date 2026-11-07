import { cn } from '@/shared/lib/utils'

interface RecordTimeValueProps {
  value: string
  size?: 'sm' | 'md' | 'lg'
}

const MAIN_CLASS = { sm: 'text-sm', md: 'text-lg', lg: 'text-xl' }
const DECIMAL_CLASS = { sm: 'text-xs', md: 'text-xs', lg: 'text-sm' }

export function RecordTimeValue({ value, size = 'sm' }: RecordTimeValueProps) {
  const [main, decimal] = value !== '--' && value.includes('.') ? value.split('.') : [value, null]
  const mainClass = MAIN_CLASS[size]
  const decimalClass = DECIMAL_CLASS[size]

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
