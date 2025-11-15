import genSolution from '@/lib/timer/genSolution'
import { useSettingsModalStore } from '@/store/SettingsModalStore'
import { useTimerStore } from '@/store/timerStore'
import { useTranslations } from 'next-intl'
import { Pencil2Icon } from '@radix-ui/react-icons'
import { Drawer, DrawerTrigger } from '@/components/ui/drawer'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Keyboard, Lightbulb } from 'lucide-react'
import { Layer } from '@/enums/Layer'
import { motion } from 'framer-motion'
import { TimerMode } from '@/enums/TimerMode'
import Image from 'next/image'
import { useWindowSize } from 'react-use-size'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { SCRAMBLE_HEIGHT } from '@/constants/scramble-height'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import DialogEnterNewScramble from '@/components/dialogs/dialog-enter-new-scramble/dialog-enter-new-scramble'
import DrawerHintPanel from '@/components/drawners/drawer-hint-panel'

export function ScrambleZone() {
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const scramble = useTimerStore((store) => store.scramble)
  const setHints = useTimerStore((store) => store.setHints)
  const isSolving = useTimerStore((store) => store.isSolving)
  const timerMode = useTimerStore((store) => store.timerMode)
  const settings = useSettingsModalStore((store) => store.settings)
  const t = useTranslations('Index')
  const { height } = useWindowSize()

  return (
    <>
      <motion.div
        className="relative mx-auto"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.3 }}
      >
        <div
          className={`h-auto text-balance p-2 text-lg md:text-xl lg:text-2xl font-semilight text-center rounded-md w-fit ${
            settings.features.scrambleBackground ? 'bg-secondary' : ''
          }`}
        >
          {height > SCRAMBLE_HEIGHT ? (
            <p data-testid="scramble-text-zone">{selectedCube ? scramble : t('HomePage.empty-scramble')}</p>
          ) : (
            <>
              {selectedCube ? (
                <Dialog>
                  <DialogTrigger className={cn('text-lg')}>[ Show scramble.. ]</DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                      <VisuallyHidden>
                        <DialogTitle>[ Show scramble ]</DialogTitle>
                      </VisuallyHidden>
                      <DialogDescription className={'text-xl text-card-foreground'}>{scramble}</DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ) : (
                t('HomePage.empty-scramble')
              )}
            </>
          )}
        </div>

        <div className="absolute bottom-0 right-0 cursor-pointer duration-300 transition translate-y-10 flex gap-3">
          <TooltipProvider delayDuration={250}>
            {!isSolving && selectedCube && (
              <Tooltip>
                <Dialog>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant={'ghost'} size={'icon'}>
                        <Pencil2Icon />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>

                  <DialogEnterNewScramble />
                  <TooltipContent>
                    <p>{t('HomePage.edit-scramble')}</p>
                  </TooltipContent>
                </Dialog>
              </Tooltip>
            )}

            {selectedCube?.category && ['3x3', '3x3 OH'].includes(selectedCube.category) && !isSolving && (
              <Drawer>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DrawerTrigger asChild>
                      <Button
                        variant={'ghost'}
                        size={'icon'}
                        onClick={() => {
                          if (!selectedCube) return
                          genSolution(selectedCube.category, scramble, Layer.YELLOW).then((res: CrossSolutions) =>
                            setHints(res)
                          )
                        }}
                      >
                        <Lightbulb />
                      </Button>
                    </DrawerTrigger>
                  </TooltipTrigger>

                  <DrawerHintPanel />
                  <TooltipContent>
                    <p>{t('HomePage.hints')}</p>
                  </TooltipContent>
                </Tooltip>
              </Drawer>
            )}
            {timerMode === TimerMode.VIRTUAL && !isSolving && selectedCube && (
              <Tooltip>
                <Dialog>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant={'ghost'} size={'icon'}>
                        <Keyboard />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Keyboard controls</DialogTitle>
                    </DialogHeader>
                    <div className="w-full flex items-center justify-center p-2">
                      <Image
                        src={'/utils/keyboard.jpg'}
                        alt={'keyboard controls'}
                        width={600}
                        height={400}
                        className="w-full h-auto"
                      />
                    </div>
                  </DialogContent>
                  <TooltipContent>
                    <p>Keyboard</p>
                  </TooltipContent>
                </Dialog>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </motion.div>
    </>
  )
}
