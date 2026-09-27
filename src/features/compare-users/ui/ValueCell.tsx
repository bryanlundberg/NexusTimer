import { Trophy } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { EMPTY_VALUE, VALUE_COLUMN } from '@/features/compare-users/model/columns'

export default function ValueCell({ value, isBest }: { value: string; isBest: boolean }) {
  const hasValue = value !== EMPTY_VALUE
  return (
    <div className={cn(VALUE_COLUMN, 'px-2 py-3 flex justify-center items-center gap-1.5')}>
      {isBest && <Trophy className={'size-3.5 text-amber-500 fill-amber-500'} />}
      <span
        className={cn(
          'text-sm tabular-nums',
          isBest
            ? 'font-bold text-amber-700 dark:text-amber-400'
            : hasValue
              ? 'font-medium text-foreground'
              : 'text-muted-foreground/40'
        )}
      >
        {value}
      </span>
    </div>
  )
}
