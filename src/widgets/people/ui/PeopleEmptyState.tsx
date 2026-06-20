'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePeopleSearch } from '@/widgets/navigation-header/model/usePeopleSearch'

export default function PeopleEmptyState() {
  const t = useTranslations('Index.PeoplePage')
  const { search, clearSearch } = usePeopleSearch()

  if (!search) {
    return <div className="py-12 text-center text-sm text-muted-foreground">{t('no-users-found')}</div>
  }

  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <p className="text-sm text-muted-foreground">
        {t.rich('no-results-for', {
          query: search,
          b: (chunks) => <span className="font-semibold text-foreground">{chunks}</span>
        })}
      </p>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={clearSearch}>
        <X className="size-4" />
        {t('clear-search')}
      </Button>
    </div>
  )
}
