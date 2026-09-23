import { create } from 'zustand'

type BackupUploadState = {
  isUploading: boolean
  isSyncing: boolean
  progress: number
  start: () => void
  setProgress: (progress: number) => void
  finish: () => void
  setSyncing: (isSyncing: boolean) => void
}

export const useBackupUploadStore = create<BackupUploadState>((set) => ({
  isUploading: false,
  isSyncing: false,
  progress: 0,
  start: () => set({ isUploading: true, progress: 0 }),
  setProgress: (progress) => set({ progress }),
  finish: () => set({ isUploading: false, progress: 0 }),
  setSyncing: (isSyncing) => set({ isSyncing })
}))
