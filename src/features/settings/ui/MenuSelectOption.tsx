'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/shared/lib/utils'
import { MenuRow } from './MenuRow'

interface MenuSelectOptionProps {
  label: string
  description?: string
  value: string
  onValueChange: (value: string) => void
  options: Array<{ value: string; label: React.ReactNode }>
  triggerClassName?: string
}

export default function MenuSelectOption({
  label,
  description,
  value,
  onValueChange,
  options,
  triggerClassName
}: MenuSelectOptionProps) {
  return (
    <MenuRow label={label} description={description}>
      <Select defaultValue={value} value={value} onValueChange={onValueChange}>
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
  )
}
