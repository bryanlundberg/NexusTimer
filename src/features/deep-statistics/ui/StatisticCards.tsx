'use client'

import { DeepStatistics } from '@/shared/types/statistics'
import { ColumnGroup, GROUP_SCOPES, useStatisticCardGroups } from '@/features/deep-statistics/model/statisticCards'
import StatisticCard from './StatisticCard'

interface StatisticCardsProps {
  statistics: DeepStatistics
  loadingProps: Record<string, boolean>
  activeGroup: ColumnGroup
}

export default function StatisticCards({ statistics, loadingProps, activeGroup }: StatisticCardsProps) {
  const groups = useStatisticCardGroups(statistics)
  const { main, session } = GROUP_SCOPES[activeGroup]

  return (
    <div className="@container mt-4 flex flex-col gap-5">
      {groups.map((group) => (
        <section key={group.key} className="flex flex-col gap-2">
          <h3 className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {group.title}
          </h3>
          <div
            className={
              group.cards.length > 3
                ? 'grid grid-cols-2 gap-1.5 @xl:grid-cols-3 @4xl:grid-cols-5'
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
