'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLeaderboards } from '@/features/leaderboards/model/useLeaderboards'
import LeaderboardTable from '@/features/leaderboards-table/ui/LeaderboardTable'
import LeaderboardTableSkeleton from '@/features/leaderboards-table/ui/LeaderboardTableSkeleton'
import LeaderboardHero from '@/features/leaderboards/ui/LeaderboardHero'
import { LEADERBOARD_PUZZLE_OPTIONS } from '@/features/leaderboards/model/puzzle-options'
import { LEADERBOARD_VIEWS } from '@/features/leaderboards/model/leaderboard-view'
import { useDeferredValue, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { parseAsStringLiteral, useQueryState } from 'nuqs'

export default function LeaderboardPage() {
  const tNavMain = useTranslations('Index.NavMain')
  const [selected, setSelected] = useState<string>(LEADERBOARD_PUZZLE_OPTIONS[0].value)
  const [view, setView] = useQueryState('view', parseAsStringLiteral(LEADERBOARD_VIEWS).withDefault('all'))

  const option = useMemo(
    () => LEADERBOARD_PUZZLE_OPTIONS.find((o) => o.value === selected) ?? LEADERBOARD_PUZZLE_OPTIONS[0],
    [selected]
  )

  const { data: solves, isLoading } = useLeaderboards(option.puzzle, option.smart, view === 'persons')

  const deferredSolves = useDeferredValue(solves)
  const isRenderingRows = deferredSolves !== solves

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <CoreHeader breadcrumbs={[{ label: tNavMain('leaderboards'), href: '/leaderboards' }]} />

      <LeaderboardHero value={selected} onChange={setSelected} view={view} onViewChange={setView} />

      <PageBody variant="data" className="space-y-8">
        {isLoading || isRenderingRows ? <LeaderboardTableSkeleton /> : <LeaderboardTable solves={deferredSolves} />}
      </PageBody>
    </ScrollArea>
  )
}
