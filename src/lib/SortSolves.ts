import { Solve } from '@/entities/solve/model/types'

interface SortSolvesProps {
  displaySolves: Solve[] | null
  sortMode: SortMode
}

export interface SortMode {
  mode: Modes
  order: Orders
}

export type Modes = 'Time' | 'Date'
export type Orders = 'Ascending' | 'Descending'

export default function sortSolves({ displaySolves, sortMode }: SortSolvesProps) {
  if (!displaySolves) return displaySolves

  if (displaySolves.length <= 0) return displaySolves

  if (sortMode.mode === 'Time') {
    if (sortMode.order === 'Ascending') {
      displaySolves.sort((a, b) => a.time - b.time)
    } else {
      displaySolves.sort((a, b) => b.time - a.time)
    }
  }

  if (sortMode.mode === 'Date') {
    if (sortMode.order === 'Ascending') {
      displaySolves.sort((a, b) => a.endTime - b.endTime)
    } else {
      displaySolves.sort((a, b) => b.endTime - a.endTime)
    }
  }

  return [...displaySolves]
}
