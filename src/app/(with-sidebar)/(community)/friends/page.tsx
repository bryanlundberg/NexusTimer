'use client'

import { useTranslations } from 'next-intl'
import { ScrollArea } from '@/components/ui/scroll-area'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { FriendsPanel } from '@/widgets/friends/ui/FriendsPanel'

export default function FriendsPage() {
  const t = useTranslations('Index.FriendsPage')

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <CoreHeader breadcrumbs={[{ label: t('title'), href: '/friends' }]} accentStripe />
      <PageBody variant="hero" className="px-2 pb-8 flex flex-col w-full max-w-2xl mx-auto">
        <FriendsPanel />
      </PageBody>
    </ScrollArea>
  )
}
