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
    <div className="px-3 py-2 transition-colors hover:bg-muted/30">
      <div className="flex justify-between items-center gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium leading-tight">{t('Settings-menu.voice-gender')}</span>
          <span className="text-xs text-muted-foreground leading-snug">
            {t('Settings-descriptions.voice-gender-description')}
          </span>
        </div>
        <Select defaultValue={voiceGender} value={voiceGender} onValueChange={handleGenderSelect}>
          <SelectTrigger className="w-[140px] sm:w-[180px] shrink-0 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">{t('Settings-menu.male')}</SelectItem>
            <SelectItem value="female">{t('Settings-menu.female')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
