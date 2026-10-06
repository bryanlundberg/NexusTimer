'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ScrollArea } from '@/components/ui/scroll-area'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { PullToRefresh } from '@/shared/ui/pull-to-refresh/PullToRefresh'
import { useFriends } from '@/entities/friendship/model/useFriends'
import { FriendsPanel } from '@/widgets/friends/ui/FriendsPanel'

export default function FriendsPage() {
  const t = useTranslations('Index.FriendsPage')
  const scrollRef = useRef<HTMLDivElement>(null)
  const { mutate } = useFriends()

  return (
    <ScrollArea ref={scrollRef} className={'max-h-dvh overflow-auto'}>
      <CoreHeader breadcrumbs={[{ label: t('title'), href: '/friends' }]} accentStripe />
      <PullToRefresh scrollerRef={scrollRef} onRefresh={mutate} />
      <PageBody variant="hero" className="px-2 pb-8 flex flex-col w-full max-w-2xl mx-auto">
        <FriendsPanel />
      </PageBody>
    </ScrollArea>
  )
}
