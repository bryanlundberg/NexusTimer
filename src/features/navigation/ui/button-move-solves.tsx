import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { EnterIcon } from '@radix-ui/react-icons'
import { useTranslations } from 'next-intl'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import DialogMoveHistorial from '@/features/move-solves-historial/ui/dialog-move-historial'

export default function ButtonMoveSolves() {
  const t = useTranslations('Index')
  const { open } = useOverlayStore()

  const handleMoveSolvesToHistory = () => {
    open({
      id: 'move-solves-historial',
      component: <DialogMoveHistorial />,
      metadata: {}
    })
  }

  return (
    <>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size={'icon'} variant={'ghost'} className={'size-7 m-auto'} onClick={handleMoveSolvesToHistory}>
              <EnterIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('SolvesPage.tooltips.move-to-history')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}
