'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BackupTipsStoreProps {
  seen: boolean
  markSeen: () => void
}

export const useBackupTipsStore = create<BackupTipsStoreProps>()(
  persist(
    (set) => ({
      seen: false,
      markSeen: () => set({ seen: true })
    }),
    {
      name: 'backup-tips-store',
      partialize: (state) => ({ seen: state.seen })
    }
  )
)
