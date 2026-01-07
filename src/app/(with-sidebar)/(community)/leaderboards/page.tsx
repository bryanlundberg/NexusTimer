'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useLeaderboards } from '@/features/leaderboards/model/useLeaderboards'
import { Spinner } from '@/components/ui/spinner'
import LeaderboardTable from '@/features/leaderboards-table/ui/LeaderboardTable'
import { useState } from 'react'
import LeaderboardBreadcrumb from '@/widgets/leaderboard-breadcrumb/ui/LeaderboardBreadcrumb'
import { useTranslations } from 'next-intl'

export default function LeaderboardPage() {
  const t = useTranslations('Index.LeaderboardsPage')
  const [puzzle, setPuzzle] = useState<string>('3x3x3')
  const { data: solves, isLoading } = useLeaderboards(puzzle)

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <FadeIn className={'p-4 md:p-8 space-y-8'}>
        <LeaderboardBreadcrumb />

        <div className="flex flex-col w-full">
          <h1 className="text-3xl font-extrabold mb-6 text-center text-primary">{t('title')}</h1>
          <p className="text-lg text-muted-foreground text-center mb-4 max-w-xl mx-auto">{t('description')}</p>
        </div>

        <div className={'flex flex-row gap-3'}>
          <div className={'flex flex-col gap-3'}>
            <Label>{t('type')}</Label>
            <Select value={puzzle} onValueChange={setPuzzle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3x3x3">Virtual 3x3</SelectItem>
                <SelectItem value="2x2x2">Virtual 2x2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className={'flex flex-row gap-3 justify-center items-center'}>
            <Spinner /> {t('thinking')}
          </div>
        ) : (
          <LeaderboardTable solves={solves} />
        )}
      </FadeIn>
    </ScrollArea>
  )
}
