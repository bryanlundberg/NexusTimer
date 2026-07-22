import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ListFilter } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSolvesFilter } from '@/features/solves-grid/model/useSolvesFilter'

export default function SolvesFilterButton() {
  const t = useTranslations('Index')
  const { enabled, hasActiveFilter, toggle } = useSolvesFilter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'} size={'icon'} className={'relative size-9'}>
          <ListFilter />
          {hasActiveFilter && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('SolvesPage.show')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
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
