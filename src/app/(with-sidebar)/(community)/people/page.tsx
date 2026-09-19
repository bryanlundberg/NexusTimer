'use client'
import * as React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { UserDocument } from '@/entities/user/model/user'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useUsers } from '@/entities/user/model/useUsers'
import { usePresenceList } from '@/features/presence/model/usePresence'
import { TablePagination } from '@/widgets/people/ui/table-pagination'
import UserCard from '@/widgets/people/ui/user-card'
import PeopleEmptyState from '@/widgets/people/ui/PeopleEmptyState'
import { useTranslations } from 'next-intl'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import PeoplePageHeader from '@/widgets/navigation-header/ui/PeoplePageHeader'
import { useQueryState } from 'nuqs'

export default function PeoplePage() {
  const t = useTranslations('Index.PeoplePage')
  const [search] = useQueryState('search')
  const [country] = useQueryState('country')
  const [page] = useQueryState('page')

  const { data, isLoading } = useUsers({
    name: search || undefined,
    country: country || undefined,
    page: Number(page) || 1
  })

  const visibleIds = React.useMemo(() => (data?.events ?? []).map((user: UserDocument) => user._id), [data?.events])
  const presence = usePresenceList(visibleIds)

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <CoreHeader breadcrumbs={[{ label: t('title'), href: '/people' }]} accentStripe />
      <PageBody variant="hero" className="px-2 pb-8 flex flex-col w-full max-w-2xl mx-auto">
        <PeoplePageHeader total={data?.docs} showing={data?.events?.length} />

        <section className="overflow-hidden border border-border/60 bg-card/40">
          {/* Skeleton rows */}
          {isLoading &&
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-3 border-b border-border/40 last:border-b-0 border-l-2 border-l-transparent"
                >
                  <Skeleton className="size-9 rounded-lg shrink-0" />
                  <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-2.5 w-28" />
                  </div>
                  <Skeleton className="h-8 w-8 sm:w-24 rounded-md shrink-0" />
                </div>
              ))}

          {/* Empty state */}
          {!isLoading && (!data?.events || data.events.length === 0) && <PeopleEmptyState />}

          {/* Rows */}
          {!isLoading &&
            data?.events &&
            data.events.length > 0 &&
            data.events.map((user: UserDocument) => (
              <UserCard key={user._id} user={user} presence={presence[user._id]} />
            ))}
        </section>

        {!isLoading && data?.pages !== undefined && data.pages > 1 && (
          <div className="mt-4">
            <TablePagination totalPages={data.pages} />
          </div>
        )}
      </PageBody>
    </ScrollArea>
  )
}
