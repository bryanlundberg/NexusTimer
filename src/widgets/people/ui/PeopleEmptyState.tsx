'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { usePeopleSearch } from '@/widgets/navigation-header/model/usePeopleSearch'

export default function PeopleEmptyState() {
  const t = useTranslations('Index.PeoplePage')
  const { search, clearSearch } = usePeopleSearch()
  const [country, setCountry] = useQueryState('country')

  const clearFilters = () => {
    clearSearch()
    setCountry(null)
  }

  if (!search) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
        <p className="text-[15px] text-muted-foreground sm:text-sm">{t('no-users-found')}</p>
        {country && (
          <Button variant="outline" size="sm" className="gap-1.5 pointer-coarse:h-10" onClick={clearFilters}>
            <X className="size-4" />
            {t('clear-filters')}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <p className="text-[15px] text-muted-foreground sm:text-sm">
        {t.rich('no-results-for', {
          query: search,
          b: (chunks) => <span className="font-semibold text-foreground">{chunks}</span>
        })}
      </p>
      <Button variant="outline" size="sm" className="gap-1.5 pointer-coarse:h-10" onClick={clearFilters}>
        <X className="size-4" />
        {t(country ? 'clear-filters' : 'clear-search')}
      </Button>
    </div>
  )
}
