import { cn } from '@/shared/lib/utils'

export interface Swatch {
  hex: string
  label: string
}

interface ColorSwatchesProps {
  swatches: readonly Swatch[]
  value: string
  onChange: (hex: string) => void
}

export function ColorSwatches({ swatches, value, onChange }: ColorSwatchesProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {swatches.map(({ hex, label }) => (
        <button
          key={hex}
          type="button"
          title={label}
          aria-label={label}
          aria-pressed={value === hex}
          onClick={() => onChange(hex)}
          style={{ background: hex }}
          className={cn(
            'size-8 border-2 transition-transform active:scale-[0.97] pointer-coarse:size-10',
            value === hex ? 'border-foreground' : 'border-transparent hover:border-foreground/40'
          )}
        />
      ))}
    </div>
  )
}
