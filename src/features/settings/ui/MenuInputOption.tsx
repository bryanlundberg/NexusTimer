import { Controller } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { triggerHaptic } from '@/shared/model/useHaptics'
import { NumberStepper } from '@/components/ui/number-stepper'
import { MenuRow } from './MenuRow'

interface MenuInputOptionProps {
  label: string
  control: any
  name: string
  min: number
  max: number
  step?: number
  scale?: number
  unit?: string
  description?: string
}

export default function MenuInputOption({
  label,
  control,
  name,
  min,
  max,
  step,
  scale,
  unit,
  description
}: MenuInputOptionProps) {
  const t = useTranslations('Index.Inputs')
  const updateSetting = useSettingsStore((state) => state.updateSetting)

  return (
    <MenuRow label={label} description={description} stack>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <NumberStepper
            aria-label={label}
            className="w-full sm:w-36"
            value={Number(value)}
            min={min}
            max={max}
            step={step}
            scale={scale}
            unit={unit}
            decrementLabel={t('decrease')}
            incrementLabel={t('increase')}
            onValueChange={(next) => {
              onChange(next)
              updateSetting(name as any, next)
              triggerHaptic()
            }}
          />
        )}
        name={name}
      />
    </MenuRow>
  )
}
