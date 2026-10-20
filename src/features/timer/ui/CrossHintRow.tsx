import { useTranslations } from 'next-intl'
import { cn } from '@/shared/lib/utils'

interface CrossHintRowProps {
  icon: 'cross' | 'xcross'
  iconClassName?: string
  label: string
  rotation: string
  moves: string
}

export function CrossHintRow({ icon, iconClassName, label, rotation, moves }: CrossHintRowProps) {
  const t = useTranslations('Index.CrossHints')
  const count = moves ? moves.split(' ').length : 0

  return (
    <div className="flex items-center gap-3 px-2 py-1.5 odd:bg-muted/50">
      <span
        aria-hidden
        className={cn('size-5 shrink-0 bg-current', iconClassName)}
        style={{
          maskImage: `url(/icons/${icon}.svg)`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center'
        }}
      />
      <span className="w-12 shrink-0 text-xs font-medium text-muted-foreground">{label}</span>
      <p className="min-w-0 flex-1 select-text font-medium">
        {count === 0 ? (
          <span className="text-muted-foreground">{t('solved')}</span>
        ) : (
          <>
            {rotation && <span className="text-muted-foreground">{rotation} </span>}
            {moves}
          </>
        )}
      </p>
      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{t('moves', { count })}</span>
    </div>
  )
}
