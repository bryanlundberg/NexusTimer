import StatisticsPanel from './StatisticsPanel'
import OverviewPanel from './OverviewPanel'
import ScramblePanel from './ScrambleImagePanel'
import SolveDelta from './SolveDelta'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useTranslations } from 'next-intl'
import { Trophy } from 'lucide-react'
import { useWindowHeight } from '@/shared/model/useWindowHeight'
import { cn } from '@/shared/lib/utils'
import { DESKTOP_MIN_WIDTH, timerStatSizes } from '@/shared/lib/statistics/averageSizes'
import { useMinWidth } from '@/shared/model/use-min-width'
import { SCRAMBLE_HEIGHT } from '@/shared/const/scramble-height'
import { TimerMode, TimerStatus } from '@/features/timer/model/enums'
import { useFocusModeStore } from '@/features/focus-mode/model/useFocusModeStore'

export default function TimerWidgets() {
  const isSolving = useTimerStore((store) => store.isSolving)
  const timerStatus = useTimerStore((store) => store.timerStatus)
  const timerStatistics = useTimerStore((store) => store.timerStatistics)
  const lastSolve = useTimerStore((store) => store.lastSolve)
  const settings = useSettingsStore((store) => store.settings)
  const t = useTranslations('Index.HomePage')
  const timerMode = useTimerStore((store) => store.timerMode)
  const isFocusMode = useFocusModeStore((store) => store.isFocusMode)
  const height = useWindowHeight()
  const isDesktop = useMinWidth(DESKTOP_MIN_WIDTH)

  const newBestAverages = timerStatSizes(settings.features, isDesktop)
    .filter((size) => {
      const best = timerStatistics.global[`ao${size}`]
      return Boolean(best) && best === timerStatistics.session[`ao${size}`]
    })
    .map((size) => `Ao${size}`)

  const compactAlert = height <= SCRAMBLE_HEIGHT && 'text-[10px]'

  const bestAverageAlert =
    settings.alerts.bestAverage && newBestAverages.length > 0 ? (
      <div
        data-testid="best-average-alert"
        className={cn(
          'flex items-center gap-1.5 w-fit px-2.5 py-1 text-xs sm:text-sm font-medium bg-record/15 text-record',
          compactAlert
        )}
      >
        <Trophy aria-hidden className="size-3.5 shrink-0 text-record" />
        <span>
          {t('new_best_average')} <span className="font-mono font-semibold">{newBestAverages.join(' · ')}</span>
        </span>
      </div>
    ) : null

  const worstTimeAlert =
    settings.alerts.worstTime &&
    timerStatistics.global.count > 1 &&
    lastSolve &&
    lastSolve.time > timerStatistics.global.worst ? (
      <div
        data-testid="worst-time-alert"
        className={cn(
          'w-fit px-2.5 py-1 text-xs sm:text-sm font-medium bg-destructive/10 text-destructive',
          compactAlert
        )}
      >
        {t('new_worst_time')}
      </div>
    ) : null

  if (isFocusMode) return null

  const isHidden = isSolving || timerStatus !== TimerStatus.IDLE

  return (
    <>
      <div
        className={cn(
          'flex flex-col gap-1 pb-1 relative max-md:transition-opacity duration-150',
          isHidden ? 'opacity-0 pointer-events-none transition-opacity' : 'opacity-100'
        )}
      >
        <div className="absolute bottom-full right-0 mb-1 flex flex-col items-end gap-1">
          {settings.alerts.solveDelta && !isHidden && lastSolve && <SolveDelta className={compactAlert || undefined} />}
          {bestAverageAlert}
          {worstTimeAlert}
        </div>
        <div
          data-testid="timer-widgets-container"
          className={cn(
            'items-end md:items-center justify-between w-full flex text-xs sm:text-md',
            height <= SCRAMBLE_HEIGHT && 'text-xs'
          )}
        >
          {settings.features.sessionStats && <OverviewPanel />}
          {settings.features.scrambleImage && timerMode !== TimerMode.VIRTUAL && <ScramblePanel />}
          {settings.features.sessionStats && <StatisticsPanel />}
        </div>
      </div>
    </>
  )
}
