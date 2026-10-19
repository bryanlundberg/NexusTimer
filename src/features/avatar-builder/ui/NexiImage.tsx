'use client'

import { useId } from 'react'
import { renderNexiSvg } from '@nexustimer/avatars'
import type { NexiRecipe } from '@nexustimer/contracts'
import { cn } from '@/shared/lib/utils'

interface NexiImageProps {
  recipe: NexiRecipe
  className?: string
}

export function NexiImage({ recipe, className }: NexiImageProps) {
  const uid = useId()

  return (
    <span
      aria-hidden
      className={cn('block shrink-0 overflow-hidden rounded-full [&>svg]:block [&>svg]:size-full', className)}
      dangerouslySetInnerHTML={{ __html: renderNexiSvg(recipe, { uid }) }}
    />
  )
}
