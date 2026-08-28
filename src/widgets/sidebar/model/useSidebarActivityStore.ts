'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UseSidebarActivityStore = {
  isCollapsed: boolean
  setCollapsed: (isCollapsed: boolean) => void
  toggle: () => void
}

export const useSidebarActivityStore = create<UseSidebarActivityStore>()(
  persist(
    (set) => ({
      isCollapsed: false,
      setCollapsed: (isCollapsed: boolean) => set({ isCollapsed }),
      toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed }))
    }),
    {
      name: 'sidebar-activity-store',
      version: 1
    }
  )
)
