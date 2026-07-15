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

        <div className="overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[3rem_minmax(0,1fr)_7rem_7rem_7rem] items-center gap-x-4 px-3 py-2 border-b border-border/60">
            <span className="hidden sm:block" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('title')}
            </span>
            <span className="hidden sm:block text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('col-country')}
            </span>
            <span className="hidden sm:block text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              WCA
            </span>
            <span className="text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground pr-1">
              {t('col-actions')}
            </span>
          </div>

          {/* Skeleton rows */}
          {isLoading &&
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[3rem_minmax(0,1fr)_7rem_7rem_7rem] items-center gap-x-4 px-3 py-3 border-b border-border/40 last:border-b-0"
                >
                  <Skeleton className="hidden sm:block size-9 rounded-lg" />
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="hidden sm:block h-3.5 w-16" />
                  <Skeleton className="hidden sm:block h-3.5 w-12" />
                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-8 w-8 sm:w-24 rounded-md" />
                  </div>
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
        </div>

        {!isLoading && data?.pages !== undefined && data.pages > 1 && (
          <div className="mt-4">
            <TablePagination totalPages={data.pages} />
          </div>
        )}
      </PageBody>
    </ScrollArea>
  )
}
