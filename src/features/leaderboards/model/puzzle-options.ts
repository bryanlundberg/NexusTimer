export interface PuzzleOption {
  value: string
  label: string
  src: string
}

export const LEADERBOARD_PUZZLE_OPTIONS: PuzzleOption[] = [
  { value: '3x3x3', label: '3x3', src: '/categories/cube333.svg' },
  { value: '2x2x2', label: '2x2', src: '/categories/cube222.svg' }
]
