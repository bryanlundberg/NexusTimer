'use client'
import { useTranslations } from 'next-intl'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { cn } from '@/shared/lib/utils'
import { TIMER_FONTS, TimerFont } from '@/features/timer/model/timerFonts'
import MenuSelectOption from './MenuSelectOption'

export default function MenuSelectTimerFont() {
  const timerFont = useSettingsStore((state) => state.settings.features.timerFont)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const t = useTranslations('Index')

  return (
    <MenuSelectOption
      label={t('Settings-menu.timer-font')}
      description={t('Settings-descriptions.timer-font')}
      value={timerFont}
      onValueChange={(value) => updateSetting('features.timerFont', value as TimerFont)}
      options={Object.entries(TIMER_FONTS).map(([value, { label, className, preview }]) => ({
        value,
        label: <span className={cn(className, preview)}>{label}</span>
      }))}
    />
  )
}
