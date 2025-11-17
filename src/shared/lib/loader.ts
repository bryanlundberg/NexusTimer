'use client'

import { create } from 'zustand'

interface LoaderState {
  isLoading: boolean
  start: () => void
  stop: () => void
}

const useLoaderStore = create<LoaderState>((set) => ({
  isLoading: false,
  start: () => set({ isLoading: true }),
  stop: () => set({ isLoading: false })
}))

const loader = {
  start: () => useLoaderStore.getState().start(),
  stop: () => useLoaderStore.getState().stop(),
  isLoading: () => useLoaderStore.getState().isLoading
}

export const useLoader = () =>
  useLoaderStore((state) => ({
    isLoading: state.isLoading
  }))

export default loader
