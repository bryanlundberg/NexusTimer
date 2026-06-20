import { Trophy } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export default function ValueCell({ value, isBest }: { value: string; isBest: boolean }) {
  const hasValue = value !== '—'
  return (
    <div className={'w-52 shrink-0 px-2 py-3 flex justify-center items-center gap-1.5'}>
      {isBest && <Trophy className={'size-3.5 text-amber-500 fill-amber-500'} />}
      <span
        className={cn(
          'text-sm tabular-nums',
          isBest ? 'font-bold text-amber-500' : hasValue ? 'font-medium text-foreground' : 'text-muted-foreground/40'
        )}
      >
        {value}
      </span>
    </div>
  )
}
