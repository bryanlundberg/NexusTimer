'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const MAX_DOCK_WINDOWS = 3

export interface DockWindow {
  chatId: string
  minimized: boolean
}

type ChatDockStore = {
  windows: DockWindow[]
  /**
   * Window the user just opened. Its input focuses once and clears this, so windows remounted
   * later (after a solve, leaving /messages) never steal the keyboard from the timer.
   */
  focusedChatId: string | null
  /** Opens (or restores) a window; the oldest one is dropped when the dock is full. */
  openWindow: (chatId: string) => void
  closeWindow: (chatId: string) => void
  toggleMinimized: (chatId: string) => void
  clearFocus: () => void
}

export const useChatDockStore = create<ChatDockStore>()(
  persist(
    (set) => ({
      windows: [],
      focusedChatId: null,
      openWindow: (chatId) =>
        set((state) => {
          const others = state.windows.filter((dockWindow) => dockWindow.chatId !== chatId)
          return {
            windows: [{ chatId, minimized: false }, ...others].slice(0, MAX_DOCK_WINDOWS),
            focusedChatId: chatId
          }
        }),
      closeWindow: (chatId) =>
        set((state) => ({
          windows: state.windows.filter((dockWindow) => dockWindow.chatId !== chatId),
          focusedChatId: state.focusedChatId === chatId ? null : state.focusedChatId
        })),
      toggleMinimized: (chatId) =>
        set((state) => ({
          windows: state.windows.map((dockWindow) =>
            dockWindow.chatId === chatId ? { ...dockWindow, minimized: !dockWindow.minimized } : dockWindow
          )
        })),
      clearFocus: () => set({ focusedChatId: null })
    }),
    {
      name: 'chat-dock-store',
      version: 2,
      migrate: () => ({ windows: [] }),
      partialize: ({ windows }) => ({ windows })
    }
  )
)
