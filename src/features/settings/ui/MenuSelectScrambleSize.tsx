'use client'
import { useTranslations } from 'next-intl'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function MenuSelectScrambleSize() {
  const { settings, updateSetting } = useSettingsStore()
  const t = useTranslations('Index')

  const handleSelect = (value: string) => {
    updateSetting('features.scrambleSize', value as 'normal' | 'large')
  }

  const scrambleSize = settings.features.scrambleSize

  return (
    <div className="px-3 py-2 transition-colors hover:bg-muted/30">
      <div className="flex justify-between items-center gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium leading-tight">{t('Settings-menu.scramble-size')}</span>
          <span className="text-xs text-muted-foreground leading-snug">{t('Settings-descriptions.scramble-size')}</span>
        </div>
        <Select defaultValue={scrambleSize} value={scrambleSize} onValueChange={handleSelect}>
          <SelectTrigger className="w-[140px] sm:w-[180px] shrink-0 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">{t('Settings-menu.scramble-size-normal')}</SelectItem>
            <SelectItem value="large">{t('Settings-menu.scramble-size-large')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
