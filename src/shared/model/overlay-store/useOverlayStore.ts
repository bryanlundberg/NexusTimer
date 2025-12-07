import { create } from 'zustand'
import React from 'react'

type OverlayConfig<T = any> = {
  id: string
  metadata?: Record<string, any>
  component: React.ReactNode
}

type OverlayStoreState = {
  activeOverlay: OverlayConfig | null
  open: <T = any>(config: OverlayConfig<T>) => void
  close: () => void
}

export const useOverlayStore = create<OverlayStoreState>((set) => ({
  activeOverlay: null,

  open: (config) => {
    set({ activeOverlay: config })
  },

  close: () => {
    set({ activeOverlay: null })
  }
}))
