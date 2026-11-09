'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLeaderboards } from '@/features/leaderboards/model/useLeaderboards'
import { useNextRefresh } from '@/features/leaderboards/model/useNextRefresh'
import LeaderboardTable from '@/features/leaderboards-table/ui/LeaderboardTable'
import LeaderboardTableSkeleton from '@/features/leaderboards-table/ui/LeaderboardTableSkeleton'
import LeaderboardPodium from '@/features/leaderboards-table/ui/LeaderboardPodium'
import LeaderboardHero from '@/features/leaderboards/ui/LeaderboardHero'
import { LEADERBOARD_PUZZLE_OPTIONS } from '@/features/leaderboards/model/puzzle-options'
import { LEADERBOARD_VIEWS } from '@/features/leaderboards/model/leaderboard-view'
import { useDeferredValue, useMemo, useRef } from 'react'
import { useTranslations } from 'next-intl'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { PullToRefresh } from '@/shared/ui/pull-to-refresh/PullToRefresh'
import { parseAsStringLiteral, useQueryState } from 'nuqs'

const PODIUM_SIZE = 3
const PUZZLE_VALUES = LEADERBOARD_PUZZLE_OPTIONS.map((option) => option.value)

export default function LeaderboardPage() {
  const tNavMain = useTranslations('Index.NavMain')
  const t = useTranslations('Index.LeaderboardsPage')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useQueryState(
    'puzzle',
    parseAsStringLiteral(PUZZLE_VALUES).withDefault(LEADERBOARD_PUZZLE_OPTIONS[0].value)
  )
  const [view, setView] = useQueryState('view', parseAsStringLiteral(LEADERBOARD_VIEWS).withDefault('persons'))

  const option = useMemo(
    () => LEADERBOARD_PUZZLE_OPTIONS.find((o) => o.value === selected) ?? LEADERBOARD_PUZZLE_OPTIONS[0],
    [selected]
  )

  const { solves, nextRefreshAt, isLoading, mutate } = useLeaderboards(option.puzzle, option.smart, view === 'persons')
  const remainingMs = useNextRefresh(nextRefreshAt, () => void mutate())

  const deferredSolves = useDeferredValue(solves)
  const isRenderingRows = deferredSolves !== solves

  const ranked = useMemo(() => (deferredSolves ?? []).filter((solve) => solve?.user), [deferredSolves])
  const hasPodium = ranked.length >= PODIUM_SIZE

  return (
    <ScrollArea ref={scrollRef} className={'max-h-dvh overflow-auto'}>
      <CoreHeader breadcrumbs={[{ label: tNavMain('leaderboards'), href: '/leaderboards' }]} />
      <PullToRefresh scrollerRef={scrollRef} onRefresh={mutate} />

      <LeaderboardHero
        value={selected}
        onChange={(value) => void setSelected(value as typeof selected)}
        view={view}
        onViewChange={setView}
        remainingMs={remainingMs}
      />

      <PageBody variant="data" className="mx-auto w-full max-w-4xl space-y-6 px-3">
        {isLoading || isRenderingRows ? (
          <LeaderboardTableSkeleton />
        ) : ranked.length === 0 ? (
          <p className="mx-auto max-w-4xl border border-border/60 bg-card/40 px-4 py-10 text-center text-sm text-muted-foreground">
            {t('empty')}
          </p>
        ) : (
          <>
            {hasPodium && <LeaderboardPodium key={`${selected}-${view}`} solves={ranked} />}
            {(!hasPodium || ranked.length > PODIUM_SIZE) && (
              <LeaderboardTable
                solves={hasPodium ? ranked.slice(PODIUM_SIZE) : ranked}
                rankOffset={hasPodium ? PODIUM_SIZE : 0}
              />
            )}
          </>
        )}
      </PageBody>
    </ScrollArea>
  )
}
