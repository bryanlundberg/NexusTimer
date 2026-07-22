import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { CountryCombobox } from '@/shared/ui/country-combobox/CountryCombobox'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'
import { usePeopleSearch } from '@/widgets/navigation-header/model/usePeopleSearch'

interface PeoplePageHeaderProps {
  total?: number
  showing?: number
}

export default function PeoplePageHeader({ total, showing }: PeoplePageHeaderProps) {
  const t = useTranslations('Index.PeoplePage')
  const { searchTerm, setSearchTerm } = usePeopleSearch()
  const basketCount = useCompareUsersStore((state) => state.users.length)
  const [country, setCountry] = useQueryState('country')
  const [, setPage] = useQueryState('page')

  const handleCountryChange = async (code: string | null) => {
    await setCountry(code)
    await setPage(null)
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
            {basketCount > 0 && (
              <>
                {' · '}
                {t.rich('compare-basket', {
                  count: basketCount,
                  b: (chunks) => <span className="font-semibold text-primary">{chunks}</span>
                })}
              </>
            )}
          </span>
        )}
      </div>

      {/* Right: search + basket */}
      <div className="flex flex-col gap-1.5 w-full sm:w-auto">
        <div className="flex flex-col-reverse sm:flex-row gap-2">
          <div className="relative group flex-1 sm:flex-none">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder={t('search-placeholder')}
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-80"
            />
          </div>
          <div className="flex items-center gap-1">
            <CountryCombobox
              value={country}
              onChange={handleCountryChange}
              placeholder={t('all-countries')}
              clearLabel={t('all-countries')}
              searchPlaceholder={t('search-country')}
              emptyText={t('no-country-found')}
              className="w-full sm:w-44 h-9"
            />
            {country && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('clear-search')}
                className="size-7 shrink-0 text-muted-foreground/60 hover:text-foreground"
                onClick={() => handleCountryChange(null)}
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
