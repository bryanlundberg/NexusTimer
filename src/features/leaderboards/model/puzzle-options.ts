import type { LeaderboardPuzzle } from '@/entities/solve/model/solve'

export interface PuzzleOption {
  value: string
  label: string
  mode: string
  puzzle: LeaderboardPuzzle
  smart: boolean
  src: string
}

export const LEADERBOARD_PUZZLE_OPTIONS: PuzzleOption[] = [
  { value: '3x3x3-smart', label: '3x3', mode: 'Smart', puzzle: '3x3x3', smart: true, src: '/categories/cube333.svg' },
  {
    value: '3x3x3-virtual',
    label: '3x3',
    mode: 'Virtual',
    puzzle: '3x3x3',
    smart: false,
    src: '/categories/cube333.svg'
  },
  {
    value: '2x2x2-virtual',
    label: '2x2',
    mode: 'Virtual',
    puzzle: '2x2x2',
    smart: false,
    src: '/categories/cube222.svg'
  }
]
