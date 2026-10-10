'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Layers } from '@/shared/types/enums'

interface CrossHintState {
  color: Layers
  setColor: (color: Layers) => void
}

export const useCrossHintStore = create<CrossHintState>()(
  persist(
    (set) => ({
      color: Layers.YELLOW,
      setColor: (color) => set({ color })
    }),
    { name: 'cross-hint' }
  )
)
