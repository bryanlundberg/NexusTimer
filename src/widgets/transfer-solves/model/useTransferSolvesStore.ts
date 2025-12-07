import { create } from 'zustand'

interface TransferSolvesState {
  selectedSolves: string[]
  setSelectedSolves: (solves: string[]) => void
  toggleSolveSelection: (solveId: string) => void
  clearSelectedSolves: () => void
}

export const useTransferSolvesStore = create<TransferSolvesState>((set) => ({
  selectedSolves: [],
  setSelectedSolves: (solves) => set({ selectedSolves: solves }),
  toggleSolveSelection: (solveId) =>
    set((state) => {
      const isSelected = state.selectedSolves.includes(solveId)
      return {
        selectedSolves: isSelected
          ? state.selectedSolves.filter((id) => id !== solveId)
          : [...state.selectedSolves, solveId]
      }
    }),
  clearSelectedSolves: () => set({ selectedSolves: [] })
}))
