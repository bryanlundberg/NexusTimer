import { create } from 'zustand';

interface AlgorithmTrainer {
  algorithm: {
    name: string;
    cube: string;
    alg: string;
  } | null;
  setAlgorithm: (algorithm: { name: string; cube: string; alg: string } | null) => void;

  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useAlgorithmTrainer = create<AlgorithmTrainer>((set) => ({
  algorithm: null,
  setAlgorithm: (algorithm) => set({ algorithm }),

  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen, ...(isOpen ? {} : { algorithm: null }) })
}));
