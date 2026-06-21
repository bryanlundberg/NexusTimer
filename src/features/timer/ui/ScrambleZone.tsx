import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { Keyboard, Lightbulb } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerTrigger } from '@/components/ui/drawer'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { cn } from '@/shared/lib/utils'
import genSolution, { prewarmSolver } from '@/shared/lib/timer/genSolution'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useScrambleGuideStore } from '@/shared/model/timer/useScrambleGuideStore'
import { truncateGuide, type ScrambleGuideItem } from '@/shared/lib/timer/scrambleGuide'
import { Layers } from '@/shared/types/enums'
import { CrossSolution } from '@/shared/types/types'

import DrawerHintPanel from '@/features/timer/ui/drawer-hint-panel'
import { TimerMode } from '@/features/timer/model/enums'
import { HINT_CATEGORIES, SCRAMBLE_GUIDE_MAX_MOVES, SCRAMBLE_SIZE_CLASSES } from '@/features/timer/model/const'
import { useScrambleOverflow } from '@/features/timer/model/useScrambleOverflow'

export function ScrambleZone() {
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const scramble = useTimerStore((store) => store.scramble)
  const setHints = useTimerStore((store) => store.setHints)
  const isSolving = useTimerStore((store) => store.isSolving)
  const timerMode = useTimerStore((store) => store.timerMode)
  const settings = useSettingsStore((store) => store.settings)
  const guide = useScrambleGuideStore((store) => store.guide)
  const scrambleReady = useScrambleGuideStore((store) => store.ready)
  const t = useTranslations('Index')

  const measureRef = useRef<HTMLParagraphElement>(null)
  const { scrambleSize, scrambleBackground } = settings.features
  const isOverflowing = useScrambleOverflow(measureRef, [scramble, selectedCube, scrambleSize])

  const sizeClasses = SCRAMBLE_SIZE_CLASSES[scrambleSize]
  const scrambleText = selectedCube ? scramble : t('HomePage.empty-scramble')
  const showGuide = guide != null && (guide.corrections.length > 0 || guide.pending.length > 0)
  const visibleGuide = guide != null ? truncateGuide(guide, SCRAMBLE_GUIDE_MAX_MOVES) : null
  const showModalButton = isOverflowing && !!selectedCube && !showGuide && !scrambleReady
  const showHintButton =
    !isSolving && !!selectedCube && HINT_CATEGORIES.includes(selectedCube.category as (typeof HINT_CATEGORIES)[number])
  const showVirtualKeyboard = timerMode === TimerMode.VIRTUAL && !isSolving && !!selectedCube

  useEffect(() => {
    if (!showHintButton) return
    prewarmSolver()
  }, [showHintButton])

  const handleShowHints = () => {
    if (!selectedCube) return
    genSolution(selectedCube.category, scramble, Layers.YELLOW).then((res: CrossSolution) => setHints(res))
  }

  const renderGuideMove = (
    item: ScrambleGuideItem,
    { isCorrection, isNext }: { isCorrection: boolean; isNext: boolean }
  ) => (
    <motion.span
      key={item.key}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.1, ease: 'easeIn' } }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={cn(
        'leading-none',
        isNext
          ? cn(
              'inline-flex items-center justify-center size-[2.1em] rounded-full border-2 font-semibold',
              isCorrection ? 'border-destructive bg-destructive/10 text-destructive' : 'border-primary bg-primary/10'
            )
          : isCorrection && 'text-destructive font-medium'
      )}
    >
      {item.move}
    </motion.span>
  )

  return (
    <div className="relative mx-auto w-full max-w-7xl">
      <div
        className={cn(
          'relative h-auto text-balance p-2 font-semilight text-center rounded-md mx-auto w-full max-w-7xl',
          sizeClasses,
          scrambleBackground && 'bg-secondary'
        )}
      >
        <p ref={measureRef} aria-hidden className="absolute inset-x-0 invisible pointer-events-none">
          {scrambleText}
        </p>

        {scrambleReady ? (
          <motion.p
            data-testid="scramble-text-zone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="font-semibold tracking-wide text-primary"
          >
            {t('HomePage.ready')}
          </motion.p>
        ) : showGuide ? (
          <p data-testid="scramble-text-zone" className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
            <AnimatePresence initial={false} mode="popLayout">
              {visibleGuide!.corrections.map((item, i) =>
                renderGuideMove(item, { isCorrection: true, isNext: i === 0 })
              )}
              {visibleGuide!.pending.map((item, i) =>
                renderGuideMove(item, {
                  isCorrection: false,
                  isNext: visibleGuide!.corrections.length === 0 && i === 0
                })
              )}
              {visibleGuide!.hiddenCount > 0 && (
                <motion.span
                  key="guide-overflow"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.1, ease: 'easeIn' } }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="leading-none text-muted-foreground font-medium select-none tabular-nums"
                >
                  …
                </motion.span>
              )}
            </AnimatePresence>
          </p>
        ) : showModalButton ? (
          <Dialog>
            <DialogTrigger className="text-sm opacity-60 hover:opacity-100 transition-opacity">
              [ Show scramble ]
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <VisuallyHidden>
                  <DialogTitle>Scramble</DialogTitle>
                </VisuallyHidden>
                <DialogDescription className={cn('text-card-foreground', sizeClasses)}>{scramble}</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        ) : (
          <p data-testid="scramble-text-zone">{scrambleText}</p>
        )}
      </div>

      <div className="absolute z-10 bottom-0 right-0 cursor-pointer duration-300 transition translate-y-10 flex gap-3">
        <TooltipProvider delayDuration={250}>
          {showHintButton && (
            <Drawer>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DrawerTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="[&>svg]:transition-all [&>svg]:duration-300 [&:hover>svg]:text-yellow-400 [&:hover>svg]:drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]"
                      onClick={handleShowHints}
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

          {showVirtualKeyboard && (
            <Tooltip>
              <Dialog>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
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
                      src="/utils/keyboard.jpg"
                      alt="keyboard controls"
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
    </div>
  )
}
