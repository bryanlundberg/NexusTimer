'use client'

import { type RefObject, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { CUBE_CATEGORIES, type CubeCategory, FRIENDS_LEADERBOARD_METRICS } from '@nexustimer/contracts'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { PullToRefresh } from '@/shared/ui/pull-to-refresh/PullToRefresh'
import { useFriendsLeaderboard } from '@/features/friends-leaderboard/model/useFriendsLeaderboard'
import FriendsLeaderboardHero from '@/features/friends-leaderboard/ui/FriendsLeaderboardHero'
import FriendsLeaderboardTable from '@/features/friends-leaderboard/ui/FriendsLeaderboardTable'
import FriendsLeaderboardNotice from '@/features/friends-leaderboard/ui/FriendsLeaderboardNotice'
import FriendsLeaderboardSkeleton from '@/features/friends-leaderboard/ui/FriendsLeaderboardSkeleton'

const DEFAULT_CATEGORY: CubeCategory = '3x3'

export default function FriendsLeaderboard({ scrollRef }: { scrollRef: RefObject<HTMLDivElement | null> }) {
  const t = useTranslations('Index.LeaderboardsPage.friends')
  const [categoryParam, setCategory] = useQueryState('category', parseAsStringLiteral(CUBE_CATEGORIES))
  const [metric, setMetric] = useQueryState(
    'metric',
    parseAsStringLiteral(FRIENDS_LEADERBOARD_METRICS).withDefault('single')
  )

  const category = categoryParam ?? DEFAULT_CATEGORY
  const { board, isLoading, isError, mutate } = useFriendsLeaderboard(category, metric)
  const listed = board?.categories

  useEffect(() => {
    if (categoryParam || !listed?.length || listed.includes(DEFAULT_CATEGORY)) return
    void setCategory(listed[0]!, { history: 'replace' })
  }, [categoryParam, listed, setCategory])

  const categories = useMemo(() => {
    if (!board || board.friendCount === 0) return []
    const known = board.categories
    return known.includes(category) ? known : [category, ...known]
  }, [board, category])

  const body = () => {
    if (isLoading && !board) return <FriendsLeaderboardSkeleton />
    if (isError || !board) return <FriendsLeaderboardNotice message={t('error')} />
    if (board.friendCount === 0) {
      return (
        <FriendsLeaderboardNotice
          message={t('no-friends-title')}
          action={{ href: '/people', label: t('find-cubers') }}
        />
      )
    }
    if (board.rows.length === 0) return <FriendsLeaderboardNotice message={t('empty')} />
    return <FriendsLeaderboardTable rows={board.rows} />
  }

  return (
    <>
      <PullToRefresh scrollerRef={scrollRef} onRefresh={mutate} />

      <FriendsLeaderboardHero
        categories={categories}
        category={category}
        onCategoryChange={(value) => void setCategory(value)}
        metric={metric}
        onMetricChange={(value) => void setMetric(value)}
      />

      <PageBody variant="data" className="mx-auto w-full max-w-4xl space-y-3 px-3 pb-8">
        {body()}
        {board && board.friendCount > 0 && <p className="px-1 text-xs text-muted-foreground">{t('source-hint')}</p>}
      </PageBody>
    </>
  )
}
