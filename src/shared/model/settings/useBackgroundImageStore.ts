'use client'
import { database } from '@/shared/config/indexdb/indexdb'
import SettingsIndexdb from '@/entities/settings/lib/settings-indexdb'

import { create } from 'zustand'
import { persist, PersistStorage } from 'zustand/middleware'

interface BackgroundImageState {
  backgroundImage: string | null
  setBackgroundImage: (imgBase64: string) => void
  deleteBackgroundImage: () => void
}

const storage: PersistStorage<Pick<BackgroundImageState, 'backgroundImage'>> = {
  getItem: async (name) => {
    if (!database.ready) await database.open()
    const images = await SettingsIndexdb.get(name)
    if (!images || !images.background) return null
    return {
      state: {
        backgroundImage: images.background
      }
    }
  },
  setItem: async (name, value) => {
    const background = value.state.backgroundImage
    if (!background) return await SettingsIndexdb.clear()
    await SettingsIndexdb.put({
      name,
      background
    })
  },
  removeItem: async () => await SettingsIndexdb.clear()
}

export const useBackgroundImageStore = create<BackgroundImageState>()(
  persist(
    (set) => ({
      backgroundImage: null,
      setBackgroundImage: (imgBase64: string) => {
        set({ backgroundImage: imgBase64 })
      },
      deleteBackgroundImage: () => {
        set({ backgroundImage: null })
      }
    }),
    {
      name: 'custom-background-image',
      storage
    }
  )
)
