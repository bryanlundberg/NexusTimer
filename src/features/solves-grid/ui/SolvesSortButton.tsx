import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ArrowDown, ArrowDownUp, ArrowUp, CalendarDays, Clock, RotateCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Order, Sort } from '@/shared/types/enums'
import { useSolvesSort } from '@/features/solves-grid/model/useSolvesSort'

export default function SolvesSortButton() {
  const t = useTranslations('Index')
  const { sortType, orderType, setSort, setOrder, reset, isDefault } = useSolvesSort()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'} size={'icon'} className={'relative size-9'} aria-label={t('SolvesPage.sort')}>
          <ArrowDownUp />
          {!isDefault && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex items-center justify-between gap-2 pr-1">
          {t('SolvesPage.sort')}
          {!isDefault && (
            <button
              type="button"
              onClick={reset}
              title={t('SolvesPage.reset-sort')}
              aria-label={t('SolvesPage.reset-sort')}
              className="flex size-5 items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <RotateCcw className="size-3" />
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sortType} onValueChange={(value) => setSort(value as Sort)}>
          <DropdownMenuRadioItem value={Sort.DATE}>
            <CalendarDays />
            {t('SolvesPage.date')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={Sort.TIME}>
            <Clock />
            {t('SolvesPage.time')}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t('SolvesPage.order')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={orderType} onValueChange={(value) => setOrder(value as Order)}>
          <DropdownMenuRadioItem value={Order.DESC}>
            <ArrowDown />
            {t('SolvesPage.descending')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={Order.ASC}>
            <ArrowUp />
            {t('SolvesPage.ascending')}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
