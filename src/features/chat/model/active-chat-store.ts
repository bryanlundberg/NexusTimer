'use client'

import { create } from 'zustand'

type ActiveChatStore = {
  activeChatId: string | null
  setActiveChat: (chatId: string) => void
  clearActiveChat: () => void
}

export const useActiveChatStore = create<ActiveChatStore>((set) => ({
  activeChatId: null,
  setActiveChat: (chatId) => set({ activeChatId: chatId }),
  clearActiveChat: () => set({ activeChatId: null })
}))
