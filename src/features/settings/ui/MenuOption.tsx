import { Controller } from 'react-hook-form'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { Switch } from '@/components/ui/switch'

interface MenuOption {
  label: string
  control: any
  name: string
  description?: string
}

export function MenuOption({ label, control, name, description }: MenuOption) {
  const updateSetting = useSettingsStore((state) => state.updateSetting)

  return (
    <div className="ps-3 pe-3 mb-3">
      <div className="flex items-center justify-between mb-1">
        <div className="grow">{label}</div>
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
      </div>
      {description && <div className="text-xs text-muted-foreground">{description}</div>}
    </div>
  )
}
