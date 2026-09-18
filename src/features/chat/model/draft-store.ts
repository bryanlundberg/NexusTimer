'use client'

import { create } from 'zustand'

type ChatDraftStore = {
  drafts: Record<string, string>
  setDraft: (chatId: string, text: string) => void
  clearDraft: (chatId: string) => void
}

export const useChatDraftStore = create<ChatDraftStore>((set) => ({
  drafts: {},
  setDraft: (chatId, text) => set((state) => ({ drafts: { ...state.drafts, [chatId]: text } })),
  clearDraft: (chatId) =>
    set((state) => {
      const { [chatId]: _, ...rest } = state.drafts
      return { drafts: rest }
    })
}))
