'use client'
import * as React from 'react'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { UserDocument } from '@/entities/user/model/user'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useUsers } from '@/entities/user/model/useUsers'
import { TablePagination } from '@/widgets/people/ui/table-pagination'
import UserCard from '@/widgets/people/ui/user-card'
import { useTranslations } from 'next-intl'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import PeoplePageHeader from '@/widgets/navigation-header/ui/PeoplePageHeader'
import { useQueryState } from 'nuqs'

export default function PeoplePage() {
  const t = useTranslations('Index.PeoplePage')
  const [search] = useQueryState('search')
  const [region] = useQueryState('region', { defaultValue: 'all' })
  const [page] = useQueryState('page')

  const { data, isLoading } = useUsers({
    name: search || undefined,
    region: region || undefined,
    page: Number(page) || 0
  })

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <FadeIn>
        <CoreHeader breadcrumbPath={'/people'} breadcrumb={t('title')} />
        <div className="px-2 pb-8 flex flex-col w-full @container/people">
          <PeoplePageHeader />

          <div
            className={'grid grid-cols-1 @xl/people:grid-cols-2 @5xl/people:grid-cols-3 @7xl/people:grid-cols-4 gap-3'}
          >
            {isLoading &&
              Array(10)
                .fill(0)
                .map((_, index) => (
                  <Card
                    key={index}
                    className="h-full bg-card/20 backdrop-blur-md flex flex-col @xs/people:flex-row items-center p-4 gap-4"
                  >
                    <div className="shrink-0">
                      <Skeleton className="size-20 rounded-full" />
                    </div>

                    <div className="flex flex-col items-center @xs/people:items-start flex-1 min-w-0 h-full">
                      <Skeleton className="h-7 w-3/4 mb-4 @xs/people:mb-auto" />

                      <div className="flex items-center gap-2 mt-auto w-full">
                        <Skeleton className="h-9 flex-1" />
                        <Skeleton className="h-9 flex-1" />
                      </div>
                    </div>
                  </Card>
                ))}

            {!isLoading && (!data?.events || data.events.length === 0) && (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">{t('no-users-found')}</p>
              </div>
            )}

            {!isLoading &&
              data?.events &&
              data.events.length > 0 &&
              data.events.map((user: UserDocument) => <UserCard key={user._id} user={user} />)}
          </div>

          <div className={'opacity-70 text-[10px] font-medium uppercase tracking-wider ps-4 pt-4 mb-2'}>
            {t('results')}: <span className="text-primary font-bold">{data?.docs || 0}</span>
          </div>

          {!isLoading && data?.pages !== undefined && data.pages > 0 && (
            <div className="mt-4">
              <TablePagination totalPages={data.pages} />
            </div>
          )}
        </div>
      </FadeIn>
    </ScrollArea>
  )
}
