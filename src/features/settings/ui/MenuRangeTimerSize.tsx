'use client'
import { useTranslations } from 'next-intl'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { triggerHaptic } from '@/shared/model/useHaptics'
import { Range } from '@/components/ui/range'
import { TIMER_SIZE } from '@/features/timer/model/timerSize'
import { MenuRow } from './MenuRow'
import TimerFontPreview from './TimerFontPreview'

export default function MenuRangeTimerSize() {
  const timerSize = useSettingsStore((state) => state.settings.features.timerSize)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const t = useTranslations('Index')
  const label = t('Settings-menu.timer-size')

  return (
    <div>
      <MenuRow label={label} description={t('Settings-descriptions.timer-size')} stack>
        <div className="flex w-full items-center gap-3 sm:w-56">
          <Range
            aria-label={label}
            aria-valuetext={`${timerSize}%`}
            min={TIMER_SIZE.min}
            max={TIMER_SIZE.max}
            step={TIMER_SIZE.step}
            value={timerSize}
            onChange={(event) => {
              updateSetting('features.timerSize', Number(event.target.value))
              triggerHaptic()
            }}
            className="flex-1"
          />
          <span className="w-10 shrink-0 text-right text-sm tabular-nums text-muted-foreground">{timerSize}%</span>
        </div>
      </MenuRow>
      <TimerFontPreview />
    </div>
  )
}
