import { Controller } from 'react-hook-form'
import React from 'react'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { MenuRow } from './MenuRow'

export default function MenuInputOption({
  label,
  control,
  name,
  inputProps,
  description
}: {
  label: string
  control: any
  name: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  description?: string
}) {
  const updateSetting = useSettingsStore((state) => state.updateSetting)

  return (
    <MenuRow label={label} description={description}>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="field-notch flex w-24 sm:w-28 shrink-0">
            <input
              type="number"
              value={typeof value === 'number' && !Number.isNaN(value) ? value : 0}
              onChange={(e) => {
                const newValue = e.target.value.replace(/[^0-9]/g, '')
                let finalValue: number
                if (inputProps?.max !== undefined && Number(newValue) > Number(inputProps.max)) {
                  finalValue = Number(inputProps.max)
                } else {
                  finalValue = Number(newValue)
                }
                onChange(finalValue)
                updateSetting(name as any, finalValue)
              }}
              className="relative z-[1] w-full min-w-0 border-0 bg-transparent px-4 py-1 text-sm outline-none"
              min={0}
              {...inputProps}
            />
          </div>
        )}
        name={name}
      />
    </MenuRow>
  )
}
