import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { SearchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import SearchSolvesDialog from './SearchSolvesDialog'

export default function SolvesSearchButton() {
  const t = useTranslations('Index')
  const open = useOverlayStore((state) => state.open)
  const [query] = useQueryState(STATES.SOLVES_PAGE.QUERY.KEY, {
    defaultValue: STATES.SOLVES_PAGE.QUERY.DEFAULT_VALUE
  })

  const hasQuery = !!query

  const handleOpenSearch = () => {
    open({
      id: 'search-solves',
      component: <SearchSolvesDialog />,
      metadata: {}
    })
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={'outline'} size={'icon'} className={'relative size-9'} onClick={handleOpenSearch}>
            <SearchIcon />
            {hasQuery && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('SolvesPage.filter-by-time')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
