import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { TimeZones } from '@/shared/types/enums'
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
  const region = searchParams!.get('region')
  const [searchTerm, setSearchTerm] = useState(search)
  const [selectedRegion, setSelectedRegion] = useState(region || 'all')

  const regionOptions = useMemo(() => Object.values(TimeZones), [])
  const basketCount = useCompareUsersStore((state) => state.users.length)

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const newSearchParams = new URLSearchParams()
    if (searchTerm) newSearchParams.set('search', searchTerm)
    if (selectedRegion && selectedRegion !== 'all') {
      newSearchParams.set('region', selectedRegion)
    } else {
      newSearchParams.delete('region')
    }
    newSearchParams.set('page', '0')
    router.push(`/people?${newSearchParams.toString()}`)
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-4">
      {/* Left: titles + count */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          People · directory
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-none">Find your cubers.</h2>
        {total !== undefined && showing !== undefined && (
          <span className="text-xs text-muted-foreground mt-0.5">
            Showing <span className="font-semibold text-foreground">{showing}</span> of{' '}
            <span className="font-semibold text-foreground">{total}</span> members
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
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="flex-1 sm:w-40">
                <SelectValue placeholder={t('region-placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('region-all')}</SelectItem>
                {regionOptions.sort().map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} className="shrink-0">
              Search
            </Button>
          </div>
        </div>
        {basketCount > 0 && (
          <span className="text-[11px] text-muted-foreground sm:text-right">
            <span className="font-semibold text-primary">{basketCount}</span> in compare basket
          </span>
        )}
      </div>
    </div>
  )
}
