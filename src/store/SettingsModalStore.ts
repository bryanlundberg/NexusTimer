import { Settings } from "@/interfaces/Settings";
import loadSettings from "@/lib/loadSettings";
import { create } from "zustand";

interface Modal {
  settingsOpen: boolean;
  setSettingsOpen: (status: boolean) => void;
  settings: Settings;
  setSettings: () => void;
}

export const useSettingsModalStore = create<Modal>((set) => ({
  settingsOpen: false,
  settings: loadSettings(),
  setSettings: () => {},
  setSettingsOpen: (status: boolean) => {
    set({ settingsOpen: status });
  },
}));
