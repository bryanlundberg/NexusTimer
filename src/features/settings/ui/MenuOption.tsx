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
    <div className="px-3 py-2 transition-colors hover:bg-muted/30">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium leading-tight">{label}</span>
          {description && <span className="text-xs text-muted-foreground leading-snug">{description}</span>}
        </div>
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
    </div>
  )
}
