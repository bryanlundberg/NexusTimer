import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ArrowDown, ArrowUp, CalendarDays, Clock, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Order, Sort } from '@/shared/types/enums'
import { useSolvesSort } from '@/features/solves-grid/model/useSolvesSort'
import { useSolvesFilter } from '@/features/solves-grid/model/useSolvesFilter'

export default function SolvesViewOptionsButton() {
  const t = useTranslations('Index')
  const { sortType, orderType, setSort, setOrder, reset: resetSort, isDefault } = useSolvesSort()
  const { enabled, hasActiveFilter, toggle, reset: resetFilter } = useSolvesFilter()

  const isCustomized = !isDefault || hasActiveFilter

  const resetAll = () => {
    resetSort()
    resetFilter()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'outline'}
          size={'icon'}
          className={'btn-notch btn-notch-alt btn-notch-border relative size-9'}
          aria-label={t('SolvesPage.view-options')}
        >
          <SlidersHorizontal />
          {isCustomized && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuLabel className="flex items-center justify-between gap-2 pr-1">
          {t('SolvesPage.view-options')}
          {isCustomized && (
            <button
              type="button"
              onClick={resetAll}
              title={t('SolvesPage.reset-view')}
              aria-label={t('SolvesPage.reset-view')}
              className="flex size-5 items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <RotateCcw className="size-3" />
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuLabel>{t('SolvesPage.sort')}</DropdownMenuLabel>
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

        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t('SolvesPage.show')}</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          highlight="rounded"
          checked={enabled.ok}
          onCheckedChange={() => toggle('ok')}
          onSelect={(e) => e.preventDefault()}
        >
          OK
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          highlight="rounded"
          checked={enabled.plus2}
          onCheckedChange={() => toggle('plus2')}
          onSelect={(e) => e.preventDefault()}
        >
          +2
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          highlight="rounded"
          checked={enabled.dnf}
          onCheckedChange={() => toggle('dnf')}
          onSelect={(e) => e.preventDefault()}
        >
          DNF
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
