import { Settings } from "@/interfaces/Settings";
import { defaultSettings } from "@/lib/defaultSettings";
import { create } from "zustand";

interface Modal {
  settingsOpen: boolean;
  setSettingsOpen: (status: boolean) => void;
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

export const useSettingsModalStore = create<Modal>((set) => ({
  settingsOpen: false,
  settings: defaultSettings,
  setSettings: (settings: Settings) => {
    set({ settings: settings });
  },
  setSettingsOpen: (status: boolean) => {
    set({ settingsOpen: status });
  },
}));
