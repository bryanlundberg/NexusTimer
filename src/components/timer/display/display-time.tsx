import { Solve } from '@/interfaces/Solve'
import formatTime from '@/lib/formatTime'
import { useTimerStore } from '@/store/timerStore'
import { useTranslations } from 'next-intl'
import { TimerMode } from '@/enums/TimerMode'
import { TimerStatus } from '@/enums/TimerStatus'
import React from 'react'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import { useSettingsModalStore } from '@/store/SettingsModalStore'
import { useWindowSize } from 'react-use-size'
import { cn } from '@/lib/utils'

interface DisplayTimeProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  className?: string
  isSolving: boolean
  lastSolve: Solve | null
  timerStatus: TimerStatus
  solvingTime: number
  device: any
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
  solvingTime,
  device,
  inspectionTime,
  inspectionRequired,
  hideWhileSolving,
  ...rest
}: DisplayTimeProps) {
  const t = useTranslations('Index.HomePage')
  const timerMode = useTimerStore((store) => store.timerMode)
  const settings = useSettingsModalStore((store) => store.settings)
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
              className="relative flex flex-col gap-1 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="flex items-end justify-center"
                animate={{
                  scale: timerStatus === TimerStatus.HOLDING ? 0.95 : 1,
                  transition: { type: 'spring', stiffness: 500, damping: 30 }
                }}
              >
                {inspectionRequired &&
                (timerStatus === TimerStatus.INSPECTING ||
                  timerStatus === TimerStatus.HOLDING ||
                  timerStatus === TimerStatus.READY) ? (
                  <>
                    <motion.div
                      className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {Math.trunc(inspectionTime)}
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      className={cn('text-8xl md:text-9xl', height < 700 ? 'text-6xl md:text-7xl' : '', 'font-light')}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {formatTime(solvingTime).split('.')[0]}
                    </motion.div>
                    <motion.div
                      className={cn('text-7xl md:text-8xl', height < 700 ? 'text-5xl md:text-6xl' : '', 'font-light')}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      .{formatTime(solvingTime, settings.timer.decimals).split('.')[1]}
                    </motion.div>
                    {lastSolve?.plus2 && !isSolving && (
                      <motion.span
                        className="text-destructive"
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
                  {timerMode === TimerMode.NORMAL
                    ? device === 'Desktop'
                      ? `${t('space-to-start')}`
                      : `${t('tap-to-start')}`
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
