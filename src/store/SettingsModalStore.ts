import { Settings } from "@/interfaces/Settings";
import { Language } from "@/interfaces/types/Language";
import { defaultSettings } from "@/lib/const/defaultSettings";
import { create } from "zustand";

interface Modal {
  settingsOpen: boolean;
  importModalOpen: boolean;
  lang: Language;
  setSettingsOpen: (status: boolean) => void;
  settings: Settings;
  setSettings: (settings: Settings) => void;
  setImportModalOpen: (status: boolean) => void;
}

export const useSettingsModalStore = create<Modal>((set) => ({
  settingsOpen: false,
  settings: defaultSettings,
  lang: "en",
  importModalOpen: false,
  setSettings: (settings: Settings) => {
    set({
      settings: settings,
      lang: settings.locale.language.lang,
    });
  },
  setSettingsOpen: (status: boolean) => {
    set({ settingsOpen: status });
  },
  setImportModalOpen: (status: boolean) => {
    set({ importModalOpen: status });
  },
}));
