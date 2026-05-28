'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLeaderboards } from '@/features/leaderboards/model/useLeaderboards'
import { Spinner } from '@/components/ui/spinner'
import LeaderboardTable from '@/features/leaderboards-table/ui/LeaderboardTable'
import LeaderboardHero from '@/features/leaderboards/ui/LeaderboardHero'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'

export default function LeaderboardPage() {
  const t = useTranslations('Index.LeaderboardsPage')
  const tNavMain = useTranslations('Index.NavMain')
  const [puzzle, setPuzzle] = useState<string>('3x3x3')
  const { data: solves, isLoading } = useLeaderboards(puzzle)

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <CoreHeader breadcrumbs={[{ label: tNavMain('leaderboards'), href: '/leaderboards' }]} />

      <LeaderboardHero puzzle={puzzle} setPuzzle={setPuzzle} />

      <PageBody variant="data" className="space-y-8">
        {isLoading ? (
          <div className={'flex flex-row gap-3 justify-center items-center'}>
            <Spinner /> {t('thinking')}
          </div>
        ) : (
          <LeaderboardTable solves={solves} />
        )}
      </PageBody>
    </ScrollArea>
  )
}
