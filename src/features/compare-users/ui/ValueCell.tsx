import { Trophy } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { EMPTY_VALUE, VALUE_COLUMN } from '@/features/compare-users/model/columns'

export default function ValueCell({ value, isBest }: { value: string; isBest: boolean }) {
  const hasValue = value !== EMPTY_VALUE
  return (
    <div className={cn(VALUE_COLUMN, 'px-2 py-3 flex justify-center items-center gap-1.5')}>
      {isBest && <Trophy className={'size-3.5 text-record fill-record'} />}
      <span
        className={cn(
          'text-sm tabular-nums',
          isBest ? 'font-bold text-record' : hasValue ? 'font-medium text-foreground' : 'text-muted-foreground/40'
        )}
      >
        {value}
      </span>
    </div>
  )
}
