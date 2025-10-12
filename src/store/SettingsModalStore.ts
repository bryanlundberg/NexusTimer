"use client";
import { Settings } from "@/interfaces/Settings";
import { defaultSettings } from "@/lib/const/defaultSettings";
import { create } from "zustand";
import { persist } from 'zustand/middleware';

// Type for nested paths in Settings object
type NestedPaths<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? `${K}` | `${K}.${NestedPaths<T[K]>}`
        : never;
    }[keyof T]
  : never;

// Type for nested values in Settings object
type NestedValues<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? NestedValues<T[K], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : never;

interface SettingsStoreProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  updateSetting: <P extends NestedPaths<Settings>>(
    path: P,
    value: NestedValues<Settings, P>
  ) => void;
}

export const useSettingsModalStore = create<SettingsStoreProps>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      setSettings: (settings: Settings) => {
        set(() => ({ settings }));
      },
      updateSetting: <P extends NestedPaths<Settings>>(
        path: P,
        value: NestedValues<Settings, P>
      ) => {
        const settings = { ...get().settings };
        const pathParts = path.split('.');
        let current: any = settings;

        for (let i = 0; i < pathParts.length - 1; i++) {
          const key = pathParts[i];
          if (key === "__proto__" || key === "constructor") {
            throw new Error("Unsafe property name detected in path.");
          }
          current = current[key];
        }

        const lastKey = pathParts[pathParts.length - 1];
        if (lastKey === "__proto__" || lastKey === "constructor") {
          throw new Error("Unsafe property name detected in path.");
        }
        current[lastKey] = value;

        set({ settings });
      },
    }),
    {
      name: 'settings-modal-store',
      version: 2,
    }
  )
);
