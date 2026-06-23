import { create } from 'zustand'
import React from 'react'

type OverlayConfig<T = any> = {
  id: string
  metadata?: Record<string, any>
  component: React.ReactNode
}

type OverlayStoreState = {
  activeOverlay: OverlayConfig | null
  isOpen: boolean
  open: <T = any>(config: OverlayConfig<T>) => void
  close: () => void
  clear: () => void
}

export const useOverlayStore = create<OverlayStoreState>((set) => ({
  activeOverlay: null,
  isOpen: false,

  open: (config) => {
    set({ activeOverlay: config, isOpen: true })
  },

  close: () => {
    set({ isOpen: false })
  },

  clear: () => {
    set({ activeOverlay: null })
  }
}))
