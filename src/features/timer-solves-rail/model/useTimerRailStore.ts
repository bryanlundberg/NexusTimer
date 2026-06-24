'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TimerRailState {
  isOpen: boolean
  toggle: () => void
  setOpen: (open: boolean) => void
}

export const useTimerRailStore = create<TimerRailState>()(
  persist(
    (set) => ({
      isOpen: true,
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (open: boolean) => set({ isOpen: open })
    }),
    {
      name: 'timer-solves-rail'
    }
  )
)
