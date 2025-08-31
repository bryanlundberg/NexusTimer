"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type WindowKey = "chat" | "scramble" | "lobby";

export type WindowState = {
  x: number;
  y: number;
  width: number;
  height: number;
  isOpen: boolean;
};

export type ClashWindowsState = {
  chat: WindowState;
  scramble: WindowState;
  lobby: WindowState;
  toggle: (key: WindowKey) => void;
  setWindow: (key: WindowKey, partial: Partial<WindowState>) => void;
  setPosition: (key: WindowKey, x: number, y: number) => void;
  setSize: (key: WindowKey, width: number, height: number) => void;
  resetAll: () => void;
};

const defaults: Record<WindowKey, WindowState> = {
  chat: { x: 0, y: 0, width: 320, height: 240, isOpen: true },
  scramble: { x: 0, y: 0, width: 100, height: 100, isOpen: true },
  lobby: { x: 340, y: 0, width: 360, height: 260, isOpen: true },
};

export const useClashWindows = create<ClashWindowsState>()(
  persist(
    (set) => ({
      ...defaults,
      toggle: (key) =>
        set((s) => ({ [key]: { ...s[key], isOpen: !s[key].isOpen } }) as any),
      setWindow: (key, partial) =>
        set((s) => ({ [key]: { ...s[key], ...partial } }) as any),
      setPosition: (key, x, y) => set((s) => ({ [key]: { ...s[key], x, y } }) as any),
      setSize: (key, width, height) =>
        set((s) => ({ [key]: { ...s[key], width, height } }) as any),
      resetAll: () =>
        set(() => ({
          chat: { ...defaults.chat, isOpen: false },
          scramble: { ...defaults.scramble, isOpen: false },
          lobby: { ...defaults.lobby, isOpen: false },
        })),
    }),
    {
      name: "clash-windows",
      version: 3,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted, version) => {
        const p = (persisted || {}) as any;
        // Map legacy stats -> chat
        if (p.stats && !p.chat) {
          p.chat = { ...p.stats };
          delete p.stats;
        }
        // Ensure required keys exist
        if (!p.chat || typeof p.chat.isOpen !== 'boolean') {
          p.chat = { ...defaults.chat };
        }
        if (!p.scramble || typeof p.scramble.isOpen !== 'boolean') {
          p.scramble = { ...defaults.scramble };
        }
        if (!p.lobby || typeof p.lobby.isOpen !== 'boolean') {
          p.lobby = { ...defaults.lobby };
        }
        return p;
      },
      partialize: (state) => ({ chat: state.chat, scramble: state.scramble, lobby: state.lobby }),
    }
  )
);
