"use client";
import { create } from "zustand";

interface SyncStoreProps {
  firstLoaded: boolean;
  setFirstLoaded: (value: boolean) => void;
}

export const useSyncStore = create<SyncStoreProps>((set) => ({
  firstLoaded: false,
  setFirstLoaded: (value: boolean) => {
    set({ firstLoaded: value });
  },
}));
