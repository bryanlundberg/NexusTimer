import { Settings } from "@/interfaces/Settings";
import { defaultSettings } from "@/lib/const/defaultSettings";
import { create } from "zustand";

interface Modal {
  settingsOpen: boolean;
  importModalOpen: boolean;
  setSettingsOpen: (status: boolean) => void;
  settings: Settings;
  setSettings: (settings: Settings) => void;
  setImportModalOpen: (status: boolean) => void;
}

export const useSettingsModalStore = create<Modal>((set) => ({
  settingsOpen: false,
  settings: defaultSettings,
  importModalOpen: false,
  setSettings: (settings: Settings) => {
    set({
      settings: settings,
    });
  },
  setSettingsOpen: (status: boolean) => {
    set({ settingsOpen: status });
  },
  setImportModalOpen: (status: boolean) => {
    set({ importModalOpen: status });
  },
}));
