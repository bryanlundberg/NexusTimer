'use client'
import * as React from 'react'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
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
  const [region] = useQueryState('region')
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
        <div className="px-2 flex flex-col w-full">
          <PeoplePageHeader />

          <div
            className={
              'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 overflow-auto'
            }
          >
            {isLoading &&
              Array(10)
                .fill(0)
                .map((_, index) => (
                  <Card key={index} className="overflow-hidden min-h-96">
                    <CardHeader className="pb-2 flex flex-col items-center">
                      <Skeleton className="size-24 rounded-full mb-2" />
                      <Skeleton className="h-6 w-32 mb-1" />
                      <Skeleton className="h-4 w-40" />
                    </CardHeader>
                    <CardContent className="pb-2 pt-0 flex flex-col items-center">
                      <Skeleton className="h-4 w-36 mb-2" />
                      <Skeleton className="h-5 w-16" />
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-center">
                      <Skeleton className="h-8 w-24" />
                    </CardFooter>
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

          <div className={'opacity-70 text-xs ps-4 pt-2'}>
            {t('results')}: {data?.docs || 0}
          </div>

          {!isLoading && <TablePagination pages={data?.pages} />}
        </div>
      </FadeIn>
    </ScrollArea>
  )
}
