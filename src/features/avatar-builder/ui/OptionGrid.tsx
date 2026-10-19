import { useDeferredValue } from 'react'
import type { NexiRecipe } from '@nexustimer/contracts'
import { OptionTile } from './OptionTile'

export interface GridOption {
  value: string
  label: string
}

interface OptionGridProps<K extends keyof NexiRecipe> {
  slot: K
  recipe: NexiRecipe
  options: readonly GridOption[]
  onChange: (slot: K, value: NexiRecipe[K]) => void
}

export function OptionGrid<K extends keyof NexiRecipe>({ slot, recipe, options, onChange }: OptionGridProps<K>) {
  const deferred = useDeferredValue(recipe)

  return (
    <div className="grid grid-cols-4 gap-1 sm:grid-cols-6">
      {options.map(({ value, label }) => (
        <OptionTile
          key={value}
          label={label}
          preview={{ ...deferred, [slot]: value }}
          selected={recipe[slot] === value}
          onSelect={() => onChange(slot, value as NexiRecipe[K])}
        />
      ))}
    </div>
  )
}
