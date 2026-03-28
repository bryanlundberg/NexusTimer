import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { UpdateIcon } from '@radix-ui/react-icons'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function ButtonNextScramble() {
  const t = useTranslations('Index')
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const setNewScramble = useTimerStore((state) => state.setNewScramble)
  const [spin, setSpin] = useState(0)

  const handleClick = () => {
    setSpin((prev) => prev + 360)
    setNewScramble(selectedCube)
  }

  return (
    <>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild disabled={selectedCube === null}>
            <Button variant={'ghost'} className="py-0 px-3" onClick={handleClick}>
              <motion.span
                className="inline-flex"
                animate={{ rotate: spin }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <UpdateIcon />
              </motion.span>
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
