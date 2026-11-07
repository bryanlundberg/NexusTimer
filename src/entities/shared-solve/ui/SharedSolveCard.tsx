import { Link } from '@/shared/config/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { PlayCircle } from 'lucide-react'
import formatTime from '@/shared/lib/formatTime'
import dayjs from '@/shared/lib/dayjs'
import { CubeCategoryTile } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { RecordTimeValue } from '@/shared/ui/record-time-value/RecordTimeValue'
import type { SharedSolveItem } from '@/entities/shared-solve/model/types'

interface Props {
  item: SharedSolveItem
}

export function SharedSolveCard({ item }: Props) {
  const locale = useLocale()
  const t = useTranslations('Index.SharedSolves')

  return (
    <Link
      href={`/s/${item.slug}`}
      className="group flex items-center gap-3 border-b border-border/40 px-3 py-2.5 transition-colors last:border-b-0 hover:bg-muted/40"
      data-testid="shared-solve-card"
    >
      <CubeCategoryTile category={item.puzzle} className="self-start" />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-baseline gap-2">
          {item.dnf ? (
            <span className="text-xl font-bold text-destructive">DNF</span>
          ) : (
            <RecordTimeValue size="lg" value={formatTime(item.time)} />
          )}
          {item.plus2 && !item.dnf && <span className="text-[10px] font-bold text-destructive">+2</span>}
          <span className="font-mono text-[10px] text-muted-foreground">{item.puzzle}</span>
        </div>
        <p className="truncate font-mono text-[10px] text-muted-foreground/70">{item.scramble}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1 self-start">
        <span className="text-[10px] text-muted-foreground">{dayjs(item.sharedAt).locale(locale).fromNow()}</span>
        {item.hasReplay && (
          <span className="inline-flex items-center gap-1 text-[10px] text-primary" title={t('has-replay')}>
            <PlayCircle className="size-3" />
            {t('replay')}
          </span>
        )}
      </div>
    </Link>
  )
}
