import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'

interface PeoplePageHeaderProps {
  total?: number
  showing?: number
}

export default function PeoplePageHeader({ total, showing }: PeoplePageHeaderProps) {
  const t = useTranslations('Index.PeoplePage')
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams!.get('search')
  const [searchTerm, setSearchTerm] = useState(search)

  const basketCount = useCompareUsersStore((state) => state.users.length)

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const newSearchParams = new URLSearchParams()
    if (searchTerm) newSearchParams.set('search', searchTerm)
    newSearchParams.set('page', '0')
    router.push(`/people?${newSearchParams.toString()}`)
  }

  return (
    <div className="flex flex-col justify-between gap-4 mb-4">
      {/* Left: titles + count */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {t('directory-label')}
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-none">{t('find-cubers')}</h2>
        {total !== undefined && showing !== undefined && (
          <span className="text-xs text-muted-foreground mt-0.5">
            {t.rich('showing-members', {
              showing,
              total,
              b: (chunks) => <span className="font-semibold text-foreground">{chunks}</span>
            })}
          </span>
        )}
      </div>

      {/* Right: search + basket */}
      <div className="flex flex-col gap-1.5 w-full sm:w-auto">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative group flex-1 sm:flex-none">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder={t('search-placeholder')}
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-52"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e as any)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="shrink-0" size="sm">
              {t('search')}
            </Button>
          </div>
        </div>
        {basketCount > 0 && (
          <span className="text-[11px] text-muted-foreground sm:text-right">
            {t.rich('compare-basket', {
              count: basketCount,
              b: (chunks) => <span className="font-semibold text-primary">{chunks}</span>
            })}
          </span>
        )}
      </div>
    </div>
  )
}
