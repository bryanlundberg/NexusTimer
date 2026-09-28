'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Sigma } from 'lucide-react'
import { Link } from '@/shared/config/i18n/navigation'
import { buttonVariants } from '@/components/ui/button'
import { Tabs } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'
import ScrollableUnderlineTabs from '@/shared/ui/animated-tabs/ScrollableUnderlineTabs'
import Segmented from '@/shared/ui/segmented/Segmented'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import type { CubeCategory } from '@/shared/const/cube-categories'
import { useFriendsRanking } from '@/features/friends/model/useFriendsRanking'
import {
  CATEGORY_METRICS,
  OVERALL,
  OVERALL_METRICS,
  rankedCategories,
  rankFriends,
  type CategoryMetric,
  type OverallMetric,
  type RankingSelection
} from '@/features/friends/model/friends-ranking'
import { FriendTable } from '@/widgets/friends/ui/FriendTable'
import { EmptyTable } from '@/widgets/friends/ui/EmptyTable'
import { FriendsRankingRow } from '@/widgets/friends/ui/FriendsRankingRow'

const DEFAULT_CATEGORY: CubeCategory = '3x3'

export function FriendsRanking() {
  const t = useTranslations('Index.FriendsPage')
  const { data, isLoading } = useFriendsRanking()
  const [picked, setPicked] = useState<string | null>(null)
  const [categoryMetric, setCategoryMetric] = useState<CategoryMetric>('single')
  const [overallMetric, setOverallMetric] = useState<OverallMetric>('solves')

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    )
  }

  const findCubers = (
    <Link href="/people" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'btn-notch btn-notch-border')}>
      {t('find-cubers')}
    </Link>
  )

  if (data.friendCount === 0) {
    return <EmptyTable message={t('ranking.no-friends')}>{findCubers}</EmptyTable>
  }

  const categories = rankedCategories(data.entries)
  const fallback = categories.includes(DEFAULT_CATEGORY) ? DEFAULT_CATEGORY : (categories[0] ?? OVERALL)
  const available: string[] = [OVERALL, ...categories]
  const active = picked && available.includes(picked) ? picked : fallback

  const selection: RankingSelection =
    active === OVERALL
      ? { category: OVERALL, metric: overallMetric }
      : { category: active as CubeCategory, metric: categoryMetric }

  const ranked = rankFriends(data.entries, selection)
  const self = ranked.find((item) => item.entry.isSelf)
  const hasBackup = data.entries.some((entry) => entry.isSelf)

  const categoryItems = [
    { value: OVERALL, icon: Sigma, label: t('ranking.overall') },
    ...categories.map((category) => ({
      value: category,
      label: (
        <span className="flex items-center gap-2">
          <span className="size-5 shrink-0">
            <CubeCategoryIcon category={category} />
          </span>
          <span className="font-mono">{category}</span>
        </span>
      )
    }))
  ]

  return (
    <div className="flex flex-col gap-3">
      <Tabs value={active} onValueChange={setPicked} className="min-w-0">
        <ScrollableUnderlineTabs items={categoryItems} activeValue={active} layoutId="friends-ranking-category" />
      </Tabs>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {selection.category === OVERALL ? (
          <Segmented
            value={overallMetric}
            onChange={setOverallMetric}
            options={OVERALL_METRICS.map((metric) => ({ value: metric, label: t(`ranking.metrics.${metric}`) }))}
            layoutId="friends-ranking-overall-metric"
            aria-label={t('ranking.metric-label')}
            className="w-full [&>button]:flex-1 [&>button]:justify-center sm:w-auto sm:[&>button]:flex-none"
          />
        ) : (
          <Segmented
            value={categoryMetric}
            onChange={setCategoryMetric}
            options={CATEGORY_METRICS.map((metric) => ({ value: metric, label: t(`ranking.metrics.${metric}`) }))}
            layoutId="friends-ranking-category-metric"
            aria-label={t('ranking.metric-label')}
            className="w-full [&>button]:flex-1 [&>button]:justify-center sm:w-auto sm:[&>button]:flex-none"
          />
        )}

        {self && (
          <p className="text-xs text-muted-foreground tabular-nums">
            {t.rich('ranking.position', {
              rank: self.rank,
              total: ranked.length,
              strong: (chunks) => <span className="font-semibold text-foreground">{chunks}</span>
            })}
          </p>
        )}
      </div>

      {!hasBackup && (
        <div className="flex flex-col gap-2 border border-dashed border-border/60 px-3 py-2.5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>{t('ranking.no-backup')}</span>
          <Link
            href="/account/save"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'btn-notch btn-notch-border self-start')}
          >
            {t('ranking.save-backup')}
          </Link>
        </div>
      )}

      {ranked.length === 0 ? (
        <EmptyTable message={t('ranking.empty')} />
      ) : (
        <FriendTable>
          {ranked.map((item) => (
            <FriendsRankingRow key={item.entry.user._id} item={item} metric={selection.metric} />
          ))}
        </FriendTable>
      )}

      <p className="text-[11px] text-muted-foreground/80 text-pretty">{t('ranking.source-hint')}</p>
    </div>
  )
}
