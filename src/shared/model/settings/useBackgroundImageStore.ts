'use client'
import { database } from '@/shared/config/indexdb/indexdb'
import Images from '@/models/indexdb/Images'

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
    const images = await Images.get(name)
    if (!images || !images.background) return null
    return {
      state: {
        backgroundImage: images.background
      }
    }
  },
  setItem: async (name, value) => {
    const background = value.state.backgroundImage
    if (!background) return await Images.clear()
    await Images.put({
      name,
      background
    })
  },
  removeItem: async () => await Images.clear()
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
