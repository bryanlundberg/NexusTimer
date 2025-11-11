import Navigation from '@/components/navigation/navigation'
import ButtonMoveSolves from '@/components/navigation/buttons/button-move-solves'
import { Input } from '@/components/ui/input'
import DropdownFilterSolves from '@/components/dropdowns/dropdown-filter-options/dropdown-filter-options'
import { useTranslations } from 'next-intl'

interface SolvesPageHeaderProps {
  handleSearch: (query: string) => void
}

export default function SolvesPageHeader({ handleSearch }: SolvesPageHeaderProps) {
  const t = useTranslations('Index')

  return (
    <div className="px-2 pt-2 flex flex-col w-full">
      <Navigation showMainCubeSelector showButtonDisplayType>
        <div className="flex gap-2">
          <ButtonMoveSolves />
          <Input
            placeholder={t('SolvesPage.filter-by-time')}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-background"
          />
          <DropdownFilterSolves />
        </div>
      </Navigation>
    </div>
  )
}
