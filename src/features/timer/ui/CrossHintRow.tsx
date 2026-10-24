import { useTranslations } from 'next-intl'
import { cn } from '@/shared/lib/utils'
import { Layers } from '@/shared/types/enums'
import { FACE_COLOR_VAR } from '@/shared/const/face-colors'

interface CrossHintRowProps {
  icon: 'cross' | 'xcross'
  color: Layers
  iconClassName?: string
  label: string
  rotation: string
  moves: string
}

export function CrossHintRow({ icon, color, iconClassName, label, rotation, moves }: CrossHintRowProps) {
  const t = useTranslations('Index.CrossHints')
  const count = moves ? moves.split(' ').length : 0

  return (
    <div className="flex items-center gap-3 border-b border-border/60 px-2 py-2 last:border-b-0">
      <span
        aria-hidden
        className={cn('size-5 shrink-0', iconClassName)}
        style={{
          backgroundColor: color === Layers.WHITE ? 'var(--foreground)' : FACE_COLOR_VAR[color],
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
