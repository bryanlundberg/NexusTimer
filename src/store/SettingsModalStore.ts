import { Settings } from "@/interfaces/Settings";
import { defaultSettings } from "@/lib/const/defaultSettings";
import { create } from "zustand";

interface SettingsStoreProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

export const useSettingsModalStore = create<SettingsStoreProps>((set) => ({
  settings: defaultSettings,
  setSettings: (settings: Settings) => {
    set({
      settings: settings,
    });
  },
}));
