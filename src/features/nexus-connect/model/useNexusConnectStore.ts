'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type NexusConnectStore = {
  nexusConnectId: string | null
  setNexusConnectId: (id: string | null) => void
}

export const useNexusConnectStore = create<NexusConnectStore>()(
  persist(
    (set) => ({
      nexusConnectId: null,
      setNexusConnectId: (id: string | null) => set({ nexusConnectId: id })
    }),
    {
      name: 'nexus-connect-storage'
    }
  )
)
