import { useSettingsModalStore } from '@/store/SettingsModalStore'
import { useTimerStore } from '@/store/timerStore'
import { ScrambleZone } from './ScrambleZone'
import { useTranslations } from 'next-intl'
import { TimerStatus } from '@/enums/TimerStatus'
import { useWindowSize } from 'react-use-size'
import { cn } from '@/lib/utils'
import { SCRAMBLE_HEIGHT } from '@/constants/scramble-height'
import Navigation from '@/features/navigation/ui/navigation'

export default function HeaderTimer() {
  const isSolving = useTimerStore((store) => store.isSolving)
  const timerStatus = useTimerStore((store) => store.timerStatus)
  const lastSolve = useTimerStore((store) => store.lastSolve)
  const timerStatistics = useTimerStore((store) => store.timerStatistics)
  const settings = useSettingsModalStore((store) => store.settings)
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
