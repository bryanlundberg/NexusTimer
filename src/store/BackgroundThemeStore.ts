import { create } from "zustand";

interface BackgroundImage {
  backgroundImage: string | null;
  setBackgroundImage: (imgBase64: string) => void;
  deleteBackgroundImage: () => void;
}

export const useBackgroundImageStore = create<BackgroundImage>((set) => ({
  backgroundImage: null,
  setBackgroundImage: (imgBase64: string) => {
    set({ backgroundImage: imgBase64 });
  },
  deleteBackgroundImage: () => {
    const storedImage = window.localStorage.getItem("customBackgroundImage");
    if (storedImage) {
      window.localStorage.removeItem("customBackgroundImage");
      set({ backgroundImage: null });
    }
  },
}));
