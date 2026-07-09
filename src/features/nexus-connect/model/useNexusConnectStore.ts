'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type NexusConnectStore = {
  nexusConnectId: string | null
  setNexusConnectId: (id: string | null) => void
  isConnected: boolean
  setIsConnected: (value: boolean) => void
}

export const useNexusConnectStore = create<NexusConnectStore>()(
  persist(
    (set) => ({
      nexusConnectId: null,
      setNexusConnectId: (id: string | null) => set({ nexusConnectId: id }),
      isConnected: false,
      setIsConnected: (value: boolean) => set({ isConnected: value })
    }),
    {
      name: 'nexus-connect-storage',
      partialize: (state) => ({ nexusConnectId: state.nexusConnectId })
    }
  )
)
