'use client'
import { useTranslations } from 'next-intl'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function MenuSelectVoiceGender() {
  const { settings, updateSetting } = useSettingsStore()
  const t = useTranslations('Index')

  const handleGenderSelect = (gender: string) => {
    updateSetting('sounds.voiceGender', gender as 'male' | 'female')
  }

  const voiceGender = settings.sounds.voiceGender

  return (
    <div className="mx-3 mb-3 mt-3">
      <div className="flex justify-between items-center mb-1">
        <div className="grow">{t('Settings-menu.voice-gender')}</div>
        <Select defaultValue={voiceGender} value={voiceGender} onValueChange={handleGenderSelect}>
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">{t('Settings-menu.male')}</SelectItem>
            <SelectItem value="female">{t('Settings-menu.female')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="text-xs text-muted-foreground">{t('Settings-descriptions.voice-gender-description')}</div>
    </div>
  )
}
