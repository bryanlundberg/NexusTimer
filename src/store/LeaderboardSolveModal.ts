import { create } from 'zustand';

interface SolveData {
  _id: string;
  scramble: string;
  time: number;
  solution?: string;
  puzzle?: string;
}

interface LeaderboardSolveModalStore {
  isOpen: boolean;
  solve: SolveData | null;
  setIsOpen: (isOpen: boolean) => void;
  setSolve: (solve: SolveData | null) => void;
  openModal: (solve: SolveData) => void;
  closeModal: () => void;
}

export const useLeaderboardSolveModal = create<LeaderboardSolveModalStore>((set) => ({
  isOpen: false,
  solve: null,
  setIsOpen: (isOpen) => set({ isOpen }),
  setSolve: (solve) => set({ solve }),
  openModal: (solve) => set({ isOpen: true, solve }),
  closeModal: () => set({ isOpen: false }),
}));
