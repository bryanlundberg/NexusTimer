'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ScrollArea } from '@/components/ui/scroll-area'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import FriendsLeaderboard from '@/features/friends-leaderboard/ui/FriendsLeaderboard'

export default function FriendsLeaderboardPage() {
  const t = useTranslations('Index.NavMain')
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <ScrollArea ref={scrollRef} className={'max-h-dvh overflow-auto'}>
      <CoreHeader breadcrumbs={[{ label: t('friends-leaderboard'), href: '/friends-leaderboard' }]} />
      <FriendsLeaderboard scrollRef={scrollRef} />
    </ScrollArea>
  )
}
