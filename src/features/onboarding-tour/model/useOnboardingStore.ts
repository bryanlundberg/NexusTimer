'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OnboardingStoreProps {
  hasCompletedTour: boolean
  lockSelectClose: boolean
  markCompleted: () => void
  setLockSelectClose: (value: boolean) => void
}

export const useOnboardingStore = create<OnboardingStoreProps>()(
  persist(
    (set) => ({
      hasCompletedTour: false,
      lockSelectClose: false,
      markCompleted: () => set({ hasCompletedTour: true }),
      setLockSelectClose: (value: boolean) => set({ lockSelectClose: value })
    }),
    {
      name: 'onboarding-tour-store',
      partialize: (state) => ({ hasCompletedTour: state.hasCompletedTour })
    }
  )
)
