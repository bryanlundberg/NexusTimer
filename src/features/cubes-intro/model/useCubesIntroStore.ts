'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CubesIntroStoreProps {
  seen: boolean
  markSeen: () => void
}

export const useCubesIntroStore = create<CubesIntroStoreProps>()(
  persist(
    (set) => ({
      seen: false,
      markSeen: () => set({ seen: true })
    }),
    {
      name: 'cubes-intro-store',
      partialize: (state) => ({ seen: state.seen })
    }
  )
)
