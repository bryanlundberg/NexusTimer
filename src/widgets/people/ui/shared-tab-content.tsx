import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'
import dayjs from '@/shared/lib/dayjs'
import { TabTableSkeleton } from '@/shared/ui/skeletons/people-skeleton'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import { SharedSolveCard } from '@/entities/shared-solve/ui/SharedSolveCard'
import type { SharedSolveItem } from '@/entities/shared-solve/model/types'
import type { useUserSharedSolves } from '@/entities/shared-solve/model/useUserSharedSolves'

interface Props {
  user: { _id: string; name: string }
  isCurrentUser: boolean
  shared: ReturnType<typeof useUserSharedSolves>
}

function groupByMonth(items: SharedSolveItem[]) {
  const groups: { key: string; items: SharedSolveItem[] }[] = []
  for (const item of items) {
    const key = dayjs(item.sharedAt).format('YYYY-MM')
    const last = groups[groups.length - 1]
    if (last?.key === key) last.items.push(item)
    else groups.push({ key, items: [item] })
  }
  return groups
}

export default function SharedTabContent({ user, isCurrentUser, shared }: Props) {
  const t = useTranslations('Index.SharedSolves')
  const locale = useLocale()
  const { items, isLoading, isLoadingMore, reachedEnd, loadMore } = shared

  if (isLoading) return <TabTableSkeleton />

  if (items.length === 0) {
    if (!isCurrentUser) return <EmptyTabContent message={t('empty-other', { name: user.name })} />
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">{t('empty-own')}</p>
        <Link href="/solves" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'btn-notch')}>
          {t('go-to-solves')}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      {groupByMonth(items).map((group) => (
        <section key={group.key} className="flex flex-col gap-2">
          <h3 className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {dayjs(`${group.key}-01`).locale(locale).format('MMMM YYYY')}
          </h3>
          <div className="flex flex-col gap-1.5">
            {group.items.map((item) => (
              <SharedSolveCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      ))}

      {!reachedEnd && (
        <Button variant="ghost" size="sm" className="self-center" disabled={isLoadingMore} onClick={loadMore}>
          {isLoadingMore && <Loader2 className="size-3.5 animate-spin" />}
          {t('load-more')}
        </Button>
      )}
    </div>
  )
}
