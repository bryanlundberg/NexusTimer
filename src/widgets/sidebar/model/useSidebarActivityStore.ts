'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SidebarActivityStore = {
  isOpen: boolean
  toggle: () => void
}

export const useSidebarActivityStore = create<SidebarActivityStore>()(
  persist(
    (set) => ({
      isOpen: false,
      toggle: () => set((state) => ({ isOpen: !state.isOpen }))
    }),
    {
      name: 'sidebar-activity-open',
      partialize: (state) => ({ isOpen: state.isOpen })
    }
  )
)
