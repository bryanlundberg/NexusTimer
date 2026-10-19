import { useId } from 'react'
import { cn } from '@/shared/lib/utils'

interface CustomColorInputProps {
  label: string
  value: string
  selected: boolean
  onChange: (hex: string) => void
}

export function CustomColorInput({ label, value, selected, onChange }: CustomColorInputProps) {
  const id = useId()

  return (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex h-9 cursor-pointer items-center gap-2 border px-2 text-xs transition-colors',
        selected ? 'border-primary/60 bg-primary/15 text-foreground' : 'border-input bg-background hover:bg-muted/40'
      )}
    >
      <input
        id={id}
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value.toLowerCase())}
        className="size-5 cursor-pointer border-0 bg-transparent p-0"
      />
      <span>{label}</span>
      <code className="text-muted-foreground">{value}</code>
    </label>
  )
}
