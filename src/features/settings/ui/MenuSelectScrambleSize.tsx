'use client'
import { useTranslations } from 'next-intl'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import MenuSelectOption from './MenuSelectOption'

export default function MenuSelectScrambleSize() {
  const scrambleSize = useSettingsStore((state) => state.settings.features.scrambleSize)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const t = useTranslations('Index')

  return (
    <MenuSelectOption
      label={t('Settings-menu.scramble-size')}
      description={t('Settings-descriptions.scramble-size')}
      value={scrambleSize}
      onValueChange={(value) => updateSetting('features.scrambleSize', value as 'normal' | 'large')}
      options={[
        { value: 'normal', label: t('Settings-menu.scramble-size-normal') },
        { value: 'large', label: t('Settings-menu.scramble-size-large') }
      ]}
    />
  )
}
