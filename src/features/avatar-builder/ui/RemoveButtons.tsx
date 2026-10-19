import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { NexiRecipe } from '@nexustimer/contracts'
import { REMOVABLE_SLOTS, SLOT_MESSAGES, type RemovableSlot } from '../model/nexiOptions'

interface RemoveButtonsProps {
  recipe: NexiRecipe
  onRemove: (slot: RemovableSlot) => void
}

export function RemoveButtons({ recipe, onRemove }: RemoveButtonsProps) {
  const t = useTranslations('Index.AvatarBuilder')
  const worn = REMOVABLE_SLOTS.filter((slot) => recipe[slot] !== 'none')
  if (worn.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {worn.map((slot) => {
        const item = t(`${SLOT_MESSAGES[slot]}.${recipe[slot]}`)
        return (
          <button
            key={slot}
            type="button"
            onClick={() => onRemove(slot)}
            aria-label={t('remove', { item })}
            className="inline-flex h-7 items-center gap-1 border border-input bg-background px-2 text-xs transition-colors hover:bg-muted/40 active:scale-[0.97] pointer-coarse:h-9"
          >
            {item}
            <X className="size-3.5 text-muted-foreground" aria-hidden />
          </button>
        )
      })}
    </div>
  )
}
