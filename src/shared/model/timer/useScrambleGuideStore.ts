import { create } from 'zustand'
import type { ScrambleGuide } from '@/shared/lib/timer/scrambleGuide'

// Bridges the live scramble guidance from SmartCubeTimer to ScrambleZone
type UseScrambleGuideStore = {
  guide: ScrambleGuide | null
  ready: boolean
  setGuide: (guide: ScrambleGuide | null) => void
  setReady: (ready: boolean) => void
  reset: () => void
}

export const useScrambleGuideStore = create<UseScrambleGuideStore>((set) => ({
  guide: null,
  ready: false,
  setGuide: (guide) => set({ guide }),
  setReady: (ready) => set({ ready }),
  reset: () => set({ guide: null, ready: false })
}))
