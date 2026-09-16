'use client'

import { create } from 'zustand'

type ActiveChatStore = {
  activeUserId: string | null
  setActiveChat: (userId: string) => void
  clearActiveChat: () => void
}

export const useActiveChatStore = create<ActiveChatStore>((set) => ({
  activeUserId: null,
  setActiveChat: (userId) => set({ activeUserId: userId }),
  clearActiveChat: () => set({ activeUserId: null })
}))
