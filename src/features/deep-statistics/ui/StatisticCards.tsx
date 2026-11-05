'use client'

import { DeepStatistics } from '@/shared/types/statistics'
import { ColumnGroup, GROUP_SCOPES, useStatisticCardGroups } from '@/features/deep-statistics/model/statisticCards'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { SlidersHorizontal } from 'lucide-react'
import { useTranslations } from 'next-intl'
import CustomAveragesModal from './CustomAveragesModal'
import StatisticCard from './StatisticCard'

interface StatisticCardsProps {
  statistics: DeepStatistics
  loadingProps: Record<string, boolean>
  activeGroup: ColumnGroup
}

export default function StatisticCards({ statistics, loadingProps, activeGroup }: StatisticCardsProps) {
  const t = useTranslations('Index.StatsPage')
  const open = useOverlayStore((store) => store.open)
  const groups = useStatisticCardGroups(statistics)
  const { main, session } = GROUP_SCOPES[activeGroup]

  return (
    <div className="@container mt-4 flex flex-col gap-5">
      {groups.map((group) => (
        <section key={group.key} className="flex flex-col gap-2">
          <div className="flex min-h-7 items-center gap-1">
            <h3 className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {group.title}
            </h3>
            {group.key === 'averages' && (
              <button
                type="button"
                onClick={() => open({ id: 'custom-averages', component: <CustomAveragesModal target="stats" /> })}
                aria-label={t('averages-title')}
                title={t('averages-title')}
                className="flex size-7 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <SlidersHorizontal aria-hidden className="size-3.5" />
              </button>
            )}
          </div>
          <div
            className={
              group.cards.length > 3
                ? 'grid grid-cols-2 gap-1.5 @2xl:grid-cols-4'
                : 'grid grid-cols-2 gap-1.5 @xl:grid-cols-3'
            }
          >
            {group.cards.map((card) => (
              <StatisticCard
                key={card.key}
                card={card}
                mainScope={main}
                sessionScope={session}
                isLoading={loadingProps[card.loadingKey]}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
