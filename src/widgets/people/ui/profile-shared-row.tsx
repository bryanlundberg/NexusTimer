import { PlayCircle } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/shared/config/i18n/navigation'
import dayjs from '@/shared/lib/dayjs'
import formatTime from '@/shared/lib/formatTime'
import { CubeCategoryTile } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import type { SharedSolveItem } from '@/entities/shared-solve/model/types'

export function ProfileSharedRow({ item }: { item: SharedSolveItem }) {
  const locale = useLocale()
  const t = useTranslations('Index.SharedSolves')

  return (
    <Link
      href={`/s/${item.slug}`}
      className="group -mx-2 flex items-center gap-2.5 px-2 py-1.5 transition-colors hover:bg-muted/40"
    >
      <CubeCategoryTile category={item.puzzle} className="size-7" />
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="flex items-baseline gap-1 text-sm font-semibold tabular-nums">
          {item.dnf ? <span className="text-destructive">DNF</span> : formatTime(item.time)}
          {item.plus2 && !item.dnf && <span className="text-[10px] font-bold text-destructive">+2</span>}
        </span>
        <span className="truncate text-[10px] text-muted-foreground">
          {item.puzzle} · {dayjs(item.sharedAt).locale(locale).fromNow()}
        </span>
      </span>
      {item.hasReplay && <PlayCircle aria-label={t('has-replay')} className="size-3.5 shrink-0 text-primary" />}
    </Link>
  )
}
