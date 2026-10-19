import type { NexiRecipe } from '@nexustimer/contracts'
import { NexiImage } from './NexiImage'

interface AvatarPreviewProps {
  recipe: NexiRecipe
}

export function AvatarPreview({ recipe }: AvatarPreviewProps) {
  return (
    <div className="flex items-end gap-3">
      <NexiImage
        recipe={recipe}
        className="size-28 sm:size-36 ring-2 ring-border ring-offset-2 ring-offset-background"
      />
      <div className="flex items-end gap-2 pb-1">
        <NexiImage recipe={recipe} className="size-10" />
        <NexiImage recipe={recipe} className="size-7" />
      </div>
    </div>
  )
}
