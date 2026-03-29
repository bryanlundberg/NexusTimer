import { Controller } from 'react-hook-form'
import React from 'react'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'

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
    <div className="px-3 py-2 transition-colors hover:bg-muted/30">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium leading-tight">{label}</span>
          {description && <span className="text-xs text-muted-foreground leading-snug">{description}</span>}
        </div>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
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
              className="px-2 py-1 w-20 sm:w-22 shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md border border-input dark:bg-input/30 text-sm"
              min={0}
              {...inputProps}
            />
          )}
          name={name}
        />
      </div>
    </div>
  )
}
