'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { triggerHaptic } from '@/shared/model/useHaptics'
import { cn } from '@/shared/lib/utils'
import { MenuRow } from './MenuRow'
import MenuSelectDrawer from './MenuSelectDrawer'

interface MenuSelectOptionProps {
  label: string
  description?: string
  value: string
  onValueChange: (value: string) => void
  options: Array<{ value: string; label: React.ReactNode }>
  triggerClassName?: string
  disabled?: boolean
}

export default function MenuSelectOption({
  label,
  description,
  value,
  onValueChange,
  options,
  triggerClassName,
  disabled
}: MenuSelectOptionProps) {
  const handleValueChange = (next: string) => {
    onValueChange(next)
    triggerHaptic()
  }

  return (
    <div>
      <MenuRow label={label} description={description} className="pointer-coarse:hidden">
        <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
          <SelectTrigger className={cn('w-[140px] sm:w-[180px] shrink-0 bg-background', triggerClassName)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </MenuRow>
      <MenuSelectDrawer
        label={label}
        description={description}
        value={value}
        onValueChange={handleValueChange}
        options={options}
        disabled={disabled}
        className="hidden pointer-coarse:flex"
      />
    </div>
  )
}
