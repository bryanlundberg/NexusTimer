import { Controller } from 'react-hook-form'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { triggerHaptic } from '@/shared/model/useHaptics'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { MenuRow } from './MenuRow'

interface MenuSegmentedOptionProps {
  label: string
  control: any
  name: string
  options: number[]
  description?: string
}

export default function MenuSegmentedOption({ label, control, name, options, description }: MenuSegmentedOptionProps) {
  const updateSetting = useSettingsStore((state) => state.updateSetting)

  return (
    <MenuRow label={label} description={description} stack>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <SegmentedControl
            aria-label={label}
            className="w-full sm:w-36"
            value={String(value)}
            options={options.map((option) => ({ value: String(option), label: option }))}
            onValueChange={(next) => {
              onChange(Number(next))
              updateSetting(name as any, Number(next))
              triggerHaptic()
            }}
          />
        )}
        name={name}
      />
    </MenuRow>
  )
}
