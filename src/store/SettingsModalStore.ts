import { create } from "zustand";

interface Modal {
  settingsOpen: boolean;
  setSettingsOpen: (status: boolean) => void;
}

export const useSettingsModalStore = create<Modal>((set) => ({
  settingsOpen: false,
  setSettingsOpen: (status: boolean) => {
    set({ settingsOpen: status });
  },
}));
