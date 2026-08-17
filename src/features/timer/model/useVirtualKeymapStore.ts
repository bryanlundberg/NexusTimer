'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { DEFAULT_VIRTUAL_KEYMAP } from './virtualKeymap'

interface VirtualKeymapState {
  // KeyboardEvent.code -> move
  keymap: Record<string, string>
  isEditorOpen: boolean
  setBinding: (code: string, move: string | null) => void
  resetKeymap: () => void
  setEditorOpen: (open: boolean) => void
}

type PersistedVirtualKeymap = Pick<VirtualKeymapState, 'keymap'>

export const useVirtualKeymapStore = create<VirtualKeymapState>()(
  persist<VirtualKeymapState, [], [], PersistedVirtualKeymap>(
    (set) => ({
      keymap: { ...DEFAULT_VIRTUAL_KEYMAP },
      isEditorOpen: false,
      setBinding: (code: string, move: string | null) =>
        set((state) => {
          const keymap = { ...state.keymap }
          if (move) keymap[code] = move
          else delete keymap[code]
          return { keymap }
        }),
      resetKeymap: () => set({ keymap: { ...DEFAULT_VIRTUAL_KEYMAP } }),
      setEditorOpen: (open: boolean) => set({ isEditorOpen: open })
    }),
    {
      name: 'virtual-keymap',
      partialize: (state) => ({ keymap: state.keymap })
    }
  )
)
