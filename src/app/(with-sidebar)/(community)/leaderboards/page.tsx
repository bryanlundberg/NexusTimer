'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useLeaderboards } from '@/features/leaderboards/model/useLeaderboards'
import { Spinner } from '@/components/ui/spinner'
import LeaderboardTable from '@/features/leaderboards-table/ui/LeaderboardTable'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'

export default function LeaderboardPage() {
  const t = useTranslations('Index.LeaderboardsPage')
  const tNavMain = useTranslations('Index.NavMain')
  const [puzzle, setPuzzle] = useState<string>('3x3x3')
  const { data: solves, isLoading } = useLeaderboards(puzzle)

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <FadeIn>
        <CoreHeader breadcrumbPath={'/leaderboards'} breadcrumb={tNavMain('leaderboards')} />

        <div className={'space-y-8'}>
          <div className={'flex flex-row gap-3 p-3'}>
            <div className={'flex flex-row gap-2 items-center'}>
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
        </div>
      </FadeIn>
    </ScrollArea>
  )
}
