import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { TimeZones } from '@/shared/types/enums'

export default function PeoplePageHeader() {
  const t = useTranslations('Index.PeoplePage')
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams!.get('search')
  const region = searchParams!.get('region')
  const [searchTerm, setSearchTerm] = useState(search)
  const [selectedRegion, setSelectedRegion] = useState(region || 'all')

  const regionOptions = useMemo(() => Object.values(TimeZones), [])

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const newSearchParams = new URLSearchParams()
    if (searchTerm) {
      newSearchParams.set('search', searchTerm)
    }
    if (selectedRegion && selectedRegion !== 'all') {
      newSearchParams.set('region', selectedRegion)
    } else {
      newSearchParams.delete('region')
    }
    newSearchParams.set('page', '0')
    router.push(`/people?${newSearchParams.toString()}`)
  }

  return (
    <div className="flex flex-col @sm/people:flex-row justify-between items-center gap-4 w-full bg-card/10 p-3 rounded-xl border border-muted/20 backdrop-blur-sm">
      <div className="flex flex-col @sm/people:flex-row items-center gap-3 w-full">
        <div className="relative w-full @sm/people:max-w-md group">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder={t('search-placeholder')}
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 bg-background/50"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e as any)}
          />
        </div>
        <div className="flex items-center gap-2 w-full @sm/people:w-auto">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full @sm/people:w-48 bg-background/50">
              <SelectValue placeholder={t('region-placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('region-all')}</SelectItem>
              {regionOptions.sort().map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSearch} className="shadow-lg shadow-primary/10">
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
