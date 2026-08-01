import { create } from 'zustand'

type UseFocusModeStore = {
  isFocusMode: boolean
  enter: () => void
  exit: () => void
  toggle: () => void
}

export const useFocusModeStore = create<UseFocusModeStore>((set) => ({
  isFocusMode: false,
  enter: () => set({ isFocusMode: true }),
  exit: () => set({ isFocusMode: false }),
  toggle: () => set((state) => ({ isFocusMode: !state.isFocusMode }))
}))
