import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import React from 'react'
import { AnimatePresence, HTMLMotionProps, motion } from 'motion/react'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useWindowSize } from 'react-use-size'
import { cn } from '@/shared/lib/utils'
import { TimerMode, TimerStatus } from '@/features/timer/model/enums'
import { Solve } from '@/entities/solve/model/types'
import { SolvingTimeDecimals, SolvingTimeInteger } from '@/features/timer/ui/SolvingTimeText'

interface DisplayTimeProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  className?: string
  isSolving: boolean
  lastSolve: Solve | null
  timerStatus: TimerStatus
  isMobile: boolean
  inspectionTime: number
  inspectionRequired: boolean
  hideWhileSolving: boolean
}

const timerStatusClasses = {
  IDLE: 'light:text-neutral-900 dark:text-white',
  HOLDING: 'light:text-pink-600 dark:text-pink-600',
  SOLVING: 'light:text-neutral-700 dark:text-slate-200',
  READY: 'text-emerald-400',
  INSPECTING: 'text-orange-500',
  WAITING_NEXT_ROUND: 'inherit'
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
  ...rest
}: DisplayTimeProps) {
  const t = useTranslations('Index.HomePage')
  const timerMode = useTimerStore((store) => store.timerMode)
  const settings = useSettingsStore((store) => store.settings)
  const { height } = useWindowSize()

  return (
    <>
      <motion.div
        className={`${timerStatusClasses[timerStatus]}`}
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
        id={'touch'}
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
              id={'touch'}
            >
              {t('solving')}
            </motion.span>
          ) : (
            <motion.div
              key="timer"
              className="relative flex flex-col gap-1 tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              id={'touch'}
            >
              <motion.div
                className="flex items-baseline justify-center"
                animate={{
                  scale: timerStatus === TimerStatus.HOLDING ? 0.95 : 1,
                  transition: { type: 'spring', stiffness: 500, damping: 30 }
                }}
                id={'touch'}
              >
                {inspectionRequired &&
                (timerStatus === TimerStatus.INSPECTING ||
                  timerStatus === TimerStatus.HOLDING ||
                  timerStatus === TimerStatus.READY) ? (
                  <motion.div
                    className={cn(
                      'font-normal',
                      height < 700
                        ? 'text-6xl sm:text-8xl md:text-9xl'
                        : 'text-7xl sm:text-9xl md:text-[11rem] lg:text-[16rem]'
                    )}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    id={'touch'}
                  >
                    {Math.trunc(inspectionTime)}
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      className={cn(
                        'font-normal',
                        height < 700
                          ? 'text-6xl sm:text-8xl md:text-9xl'
                          : 'text-7xl sm:text-9xl md:text-[11rem] lg:text-[16rem]'
                      )}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      id={'touch'}
                    >
                      <SolvingTimeInteger />
                    </motion.div>
                    <motion.div
                      className={cn(
                        'font-normal',
                        height < 700
                          ? 'text-4xl sm:text-6xl md:text-7xl'
                          : 'text-5xl sm:text-7xl md:text-8xl lg:text-[10rem]'
                      )}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      id={'touch'}
                    >
                      <SolvingTimeDecimals decimals={settings.timer.decimals} />
                    </motion.div>
                    {lastSolve?.plus2 && !isSolving && (
                      <motion.span
                        className={cn(
                          'text-destructive font-normal',
                          height < 700 ? 'text-2xl sm:text-4xl' : 'text-3xl sm:text-5xl lg:text-6xl'
                        )}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        id={'touch'}
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
                  id={'touch'}
                >
                  {timerMode === TimerMode.NORMAL
                    ? isMobile
                      ? `${t('tap-to-start')}`
                      : `${t('space-to-start')}`
                    : null}

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
