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
    <div className="flex justify-between items-center gap-2 w-full mb-2">
      <div className={'flex items-center justify-between gap-2 ms-auto w-full'}>
        <div className={'flex sm:flex-row items-center gap-3 w-full justify-end'}>
          <div className={'flex flex-col sm:flex-row items-center gap-2 grow justify-end'}>
            <Input
              placeholder={t('search-placeholder')}
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full sm:w-48">
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
          </div>
          <Button size={'icon'} onClick={handleSearch}>
            <MagnifyingGlassIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
