import { useState } from 'react'
import { DEFAULT_NEXI_RECIPE, randomNexiRecipe } from '@nexustimer/avatars'
import type { NexiRecipe } from '@nexustimer/contracts'
import type { BuilderTab, RemovableSlot } from './nexiOptions'

export function useAvatarBuilder() {
  const [recipe, setRecipe] = useState<NexiRecipe>(DEFAULT_NEXI_RECIPE)
  const [tab, setTab] = useState<BuilderTab>('shape')

  const change = <K extends keyof NexiRecipe>(slot: K, value: NexiRecipe[K]) =>
    setRecipe((current) => ({ ...current, [slot]: value }))

  const remove = (slot: RemovableSlot) => setRecipe((current) => ({ ...current, [slot]: 'none' }))

  const randomize = () => setRecipe(randomNexiRecipe(crypto.randomUUID()))

  return { recipe, tab, setTab, change, remove, randomize }
}
