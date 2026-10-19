import type { NexiRecipe } from '@nexustimer/contracts'
import { cn } from '@/shared/lib/utils'
import { NexiImage } from './NexiImage'

interface OptionTileProps {
  label: string
  preview: NexiRecipe
  selected: boolean
  onSelect: () => void
}

export function OptionTile({ label, preview, selected, onSelect }: OptionTileProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      title={label}
      onClick={onSelect}
      className={cn(
        'flex min-w-0 flex-col items-center gap-1 border p-1.5 text-[11px] transition-colors active:scale-[0.97]',
        selected
          ? 'border-primary/60 bg-primary/15 text-foreground'
          : 'border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground'
      )}
    >
      <NexiImage recipe={preview} className="aspect-square w-full max-w-20" />
      <span className="w-full truncate text-center">{label}</span>
    </button>
  )
}
