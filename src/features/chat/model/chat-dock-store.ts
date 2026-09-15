'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const MAX_DOCK_WINDOWS = 3

export interface DockWindow {
  userId: string
  minimized: boolean
}

type ChatDockStore = {
  windows: DockWindow[]
  /**
   * Window the user just opened. Its input focuses once and clears this, so windows remounted
   * later (after a solve, leaving /messages) never steal the keyboard from the timer.
   */
  focusedUserId: string | null
  /** Opens (or restores) a window; the oldest one is dropped when the dock is full. */
  openWindow: (userId: string) => void
  closeWindow: (userId: string) => void
  toggleMinimized: (userId: string) => void
  clearFocus: () => void
}

export const useChatDockStore = create<ChatDockStore>()(
  persist(
    (set) => ({
      windows: [],
      focusedUserId: null,
      openWindow: (userId) =>
        set((state) => {
          const others = state.windows.filter((dockWindow) => dockWindow.userId !== userId)
          return {
            windows: [{ userId, minimized: false }, ...others].slice(0, MAX_DOCK_WINDOWS),
            focusedUserId: userId
          }
        }),
      closeWindow: (userId) =>
        set((state) => ({
          windows: state.windows.filter((dockWindow) => dockWindow.userId !== userId),
          focusedUserId: state.focusedUserId === userId ? null : state.focusedUserId
        })),
      toggleMinimized: (userId) =>
        set((state) => ({
          windows: state.windows.map((dockWindow) =>
            dockWindow.userId === userId ? { ...dockWindow, minimized: !dockWindow.minimized } : dockWindow
          )
        })),
      clearFocus: () => set({ focusedUserId: null })
    }),
    {
      name: 'chat-dock-store',
      version: 1,
      partialize: ({ windows }) => ({ windows })
    }
  )
)
