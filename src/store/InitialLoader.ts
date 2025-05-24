import { create } from 'zustand';

interface StoreState {
  hasShownLoader: boolean;
  setHasShownLoader: (value: boolean) => void;

  showLoader: boolean;
  setShowLoader: (value: boolean) => void;
}

const useInitialLoader = create<StoreState>((set) => ({
  hasShownLoader: false,
  setHasShownLoader: (value: boolean) => set({ hasShownLoader: value }),

  showLoader: true,
  setShowLoader: (value: boolean) => set({ showLoader: value })
}));

export default useInitialLoader;
