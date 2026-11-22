import { create } from 'zustand'

interface CtrlPadsStore {
  left: boolean
  right: boolean
  setPads: (left: boolean, right: boolean) => void
}

export const useCtrlPadsStore = create<CtrlPadsStore>((set, get) => ({
  left: false,
  right: false,
  setPads: (left, right) => {
    const current = get()
    if (current.left === left && current.right === right) return
    set({ left, right })
  }
}))
