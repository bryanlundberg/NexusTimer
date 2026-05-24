'use client'
import { useTranslations } from 'next-intl'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import MenuSelectOption from './MenuSelectOption'

export default function MenuSelectVoiceGender() {
  const voiceGender = useSettingsStore((state) => state.settings.sounds.voiceGender)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const t = useTranslations('Index')

  return (
    <MenuSelectOption
      label={t('Settings-menu.voice-gender')}
      description={t('Settings-descriptions.voice-gender-description')}
      value={voiceGender}
      onValueChange={(value) => updateSetting('sounds.voiceGender', value as 'male' | 'female')}
      options={[
        { value: 'male', label: t('Settings-menu.male') },
        { value: 'female', label: t('Settings-menu.female') }
      ]}
    />
  )
}
