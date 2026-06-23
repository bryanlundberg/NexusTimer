import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'
import RefreshIcon from '@/components/ui/refresh-icon'
import type { AnimatedIconHandle } from '@/components/ui/types'

export default function ButtonNextScramble() {
  const t = useTranslations('Index')
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const setNewScramble = useTimerStore((state) => state.setNewScramble)
  const iconRef = useRef<AnimatedIconHandle>(null)

  const handleClick = () => {
    setNewScramble(selectedCube)
  }

  return (
    <>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild disabled={selectedCube === null}>
            <Button
              variant={'ghost'}
              className="py-0 px-3"
              onClick={handleClick}
              onMouseEnter={() => iconRef.current?.startAnimation()}
              onMouseLeave={() => iconRef.current?.stopAnimation()}
            >
              <RefreshIcon ref={iconRef} size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('HomePage.new-scramble')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}
