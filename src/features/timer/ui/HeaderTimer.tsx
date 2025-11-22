import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { ScrambleZone } from './ScrambleZone'
import { useTranslations } from 'next-intl'
import { useWindowSize } from 'react-use-size'
import { cn } from '@/lib/utils'
import Navigation from '@/features/navigation/ui/navigation'
import { SCRAMBLE_HEIGHT } from '@/shared/const/scramble-height'
import { TimerStatus } from '@/features/timer/model/enums'

export default function HeaderTimer() {
  const isSolving = useTimerStore((store) => store.isSolving)
  const timerStatus = useTimerStore((store) => store.timerStatus)
  const lastSolve = useTimerStore((store) => store.lastSolve)
  const timerStatistics = useTimerStore((store) => store.timerStatistics)
  const settings = useSettingsStore((store) => store.settings)
  const t = useTranslations('Index.HomePage')
  const { height } = useWindowSize()

  if (isSolving || timerStatus !== TimerStatus.IDLE) return null

  const isPersonalBest =
    lastSolve != null && !lastSolve.dnf && lastSolve.time <= timerStatistics.global.best && settings.alerts.bestTime
  return (
    <>
      <Navigation showButtonNextScramble showButtonSelectMode showMainCubeSelector />
      <ScrambleZone />
      {isPersonalBest && (
        <div
          id="touch"
          className={cn(
            'text-center text-xs mt-10',
            timerStatus !== TimerStatus.IDLE ? 'opacity-0' : 'opacity-100',
            height <= SCRAMBLE_HEIGHT && 'mt-5'
          )}
        >
          <p>{t('congratulations')}</p>
          <p>{t('personal_best')}</p>
        </div>
      )}
    </>
  )
}
