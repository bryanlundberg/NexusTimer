'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TrainerPrefsState {
  showSolveInfo: boolean
  toggleShowSolveInfo: () => void
}

export const useTrainerPrefsStore = create<TrainerPrefsState>()(
  persist(
    (set) => ({
      showSolveInfo: true,
      toggleShowSolveInfo: () => set((s) => ({ showSolveInfo: !s.showSolveInfo }))
    }),
    { name: 'trainer-prefs' }
  )
)
