import { Controller } from 'react-hook-form'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { triggerHaptic } from '@/shared/model/useHaptics'
import { Switch } from '@/components/ui/switch'
import { MenuRow } from './MenuRow'

interface MenuOption {
  label: string
  control: any
  name: string
  description?: string
}

export function MenuOption({ label, control, name, description }: MenuOption) {
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const id = `setting-${name.replace(/\./g, '-')}`

  return (
    <MenuRow label={label} description={description} htmlFor={id}>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Switch
            id={id}
            checked={Boolean(value)}
            onCheckedChange={(checked) => {
              onChange(checked)
              updateSetting(name as any, checked)
              triggerHaptic()
            }}
          />
        )}
        name={name}
      />
    </MenuRow>
  )
}
