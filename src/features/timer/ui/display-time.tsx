import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import React from 'react'
import { AnimatePresence, HTMLMotionProps, MotionStyle, motion } from 'motion/react'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useWindowHeight } from '@/shared/model/useWindowHeight'
import { cn } from '@/shared/lib/utils'
import { TimerMode, TimerStatus } from '@/features/timer/model/enums'
import { Solve } from '@/entities/solve/model/types'
import { SolvingTimeDecimals, SolvingTimeInteger } from '@/features/timer/ui/SolvingTimeText'
import DigitCells from '@/shared/ui/digit-cells/DigitCells'
import { useTimerFit } from '@/features/timer/model/useTimerFit'
import { timerFontClass } from '@/features/timer/model/timerFonts'
import { TIMER_MAX_VIEWPORT_HEIGHT, timerScale } from '@/features/timer/model/timerSize'
import { inspectionLabel } from '@/features/timer/lib/inspection'

interface DisplayTimeProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  className?: string
  isSolving: boolean
  lastSolve: Solve | null
  timerStatus: TimerStatus
  isMobile: boolean
  inspectionTime: number
  inspectionRequired: boolean
  hideWhileSolving: boolean
  isRecord?: boolean
}

const timerStatusClasses = {
  IDLE: 'text-foreground',
  HOLDING: 'text-timer-holding',
  SOLVING: 'text-foreground/85',
  READY: 'text-timer-ready',
  INSPECTING: 'text-timer-inspect',
  WAITING_NEXT_ROUND: 'inherit'
}

const FIT_TEXT = 'text-[length:calc(var(--t)*var(--timer-scale,1)*var(--timer-fit,1))] leading-none'
const MAIN_SIZE = {
  short: '[--t:3.75rem] sm:[--t:6rem] md:[--t:8rem]',
  tall: '[--t:4.5rem] sm:[--t:8rem] md:[--t:11rem] lg:[--t:16rem]'
}
const DECIMAL_SIZE = {
  short: '[--t:2.25rem] sm:[--t:3.75rem] md:[--t:4.5rem]',
  tall: '[--t:3rem] sm:[--t:4.5rem] md:[--t:6rem] lg:[--t:10rem]'
}
const PENALTY_SIZE = {
  short: '[--t:1.5rem] sm:[--t:2.25rem]',
  tall: '[--t:1.875rem] sm:[--t:3rem] lg:[--t:3.75rem]'
}

export default function DisplayTime({
  className,
  isSolving,
  lastSolve,
  timerStatus,
  isMobile,
  inspectionTime,
  inspectionRequired,
  hideWhileSolving,
  isRecord = false,
  ...rest
}: DisplayTimeProps) {
  const t = useTranslations('Index.HomePage')
  const timerMode = useTimerStore((store) => store.timerMode)
  const settings = useSettingsStore((store) => store.settings)
  const height = useWindowHeight()
  const fitRef = useTimerFit(TIMER_MAX_VIEWPORT_HEIGHT)
  const size = height < 700 ? 'short' : 'tall'
  const showRecord = isRecord && timerStatus === TimerStatus.IDLE
  const font = timerFontClass(settings.features.timerFont)

  return (
    <>
      <motion.div
        className={cn('w-full', showRecord ? 'text-record' : timerStatusClasses[timerStatus])}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          scale: timerStatus === TimerStatus.READY ? 1.05 : 1,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 20
          }
        }}
        {...rest}
      >
        <AnimatePresence mode="wait">
          {hideWhileSolving && isSolving ? (
            <motion.span
              key="solving"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {t('solving')}
            </motion.span>
          ) : (
            <motion.div
              key="timer"
              style={{ '--timer-scale': timerScale(settings.features.timerSize) } as MotionStyle}
              className="relative flex flex-col gap-1 tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                ref={fitRef}
                className="flex items-baseline justify-center whitespace-nowrap"
                animate={{
                  scale: timerStatus === TimerStatus.HOLDING ? 0.95 : 1,
                  transition: { type: 'spring', stiffness: 500, damping: 30 }
                }}
              >
                {inspectionRequired &&
                (timerStatus === TimerStatus.INSPECTING ||
                  timerStatus === TimerStatus.HOLDING ||
                  timerStatus === TimerStatus.READY) ? (
                  <motion.div
                    className={cn(font, 'font-normal', FIT_TEXT, MAIN_SIZE[size])}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <DigitCells text={inspectionLabel(inspectionTime)} />
                  </motion.div>
                ) : lastSolve?.dnf && !isSolving ? (
                  <motion.div
                    className={cn(
                      font,
                      'font-normal',
                      FIT_TEXT,
                      MAIN_SIZE[size],
                      timerStatus === TimerStatus.IDLE && 'text-destructive'
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    DNF
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      className={cn(font, 'font-normal', FIT_TEXT, MAIN_SIZE[size])}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SolvingTimeInteger />
                    </motion.div>
                    <motion.div
                      className={cn(font, 'font-normal', FIT_TEXT, DECIMAL_SIZE[size])}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <SolvingTimeDecimals decimals={settings.timer.decimals} />
                    </motion.div>
                    {lastSolve?.plus2 && !isSolving && (
                      <motion.span
                        className={cn('text-destructive', font, 'font-normal', FIT_TEXT, PENALTY_SIZE[size])}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        +2
                      </motion.span>
                    )}
                  </>
                )}
              </motion.div>
              {!lastSolve && timerStatus === TimerStatus.IDLE ? (
                <motion.div
                  className="text-xs text-center"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: [0.5, 1, 0.5], y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  {timerMode === TimerMode.NORMAL && (isMobile ? t('tap-to-start') : t('space-to-start'))}

                  {timerMode === TimerMode.KEYBOARD_STACKMAT && t('hold-ctrl-to-start')}

                  {timerMode === TimerMode.STACKMAT && t('start-stackmat')}
                </motion.div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
