import { Controller } from 'react-hook-form'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
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

  return (
    <MenuRow label={label} description={description}>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(checked) => {
              onChange(checked)
              updateSetting(name as any, checked)
            }}
          />
        )}
        name={name}
      />
    </MenuRow>
  )
}
