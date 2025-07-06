import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BackgroundImage {
  backgroundImage: string | null;
  setBackgroundImage: (imgBase64: string) => void;
  deleteBackgroundImage: () => void;
}

export const useBackgroundImageStore = create<BackgroundImage>()(
  persist(
    (set) => ({
      backgroundImage: null,
      setBackgroundImage: (imgBase64: string) => {
        set({ backgroundImage: imgBase64 });
      },
      deleteBackgroundImage: () => {
        set({ backgroundImage: null });
      },
    }),
    {
      name: 'customBackgroundImage',
    }
  )
);
