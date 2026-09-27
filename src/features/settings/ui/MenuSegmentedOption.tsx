import { Controller } from 'react-hook-form'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { triggerHaptic } from '@/shared/model/useHaptics'
import Segmented from '@/shared/ui/segmented/Segmented'
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
          <Segmented
            aria-label={label}
            layoutId={`segmented-${name}`}
            className="w-full tabular-nums sm:w-auto [&>button]:flex-1 [&>button]:justify-center sm:[&>button]:min-w-11"
            value={String(value)}
            options={options.map((option) => ({ value: String(option), label: option }))}
            onChange={(next) => {
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
