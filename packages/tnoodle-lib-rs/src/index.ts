import type { CubeCategory } from '@nexustimer/contracts'

export const PUZZLE_KEYS = [
  '222',
  '333',
  '333ni',
  '444',
  '444ni',
  '555',
  '666',
  '777',
  'pyram',
  'sq1',
  'minx',
  'clock',
  'skewb',
  'fto'
] as const

export type PuzzleKey = (typeof PUZZLE_KEYS)[number]

export const PUZZLE_BY_CATEGORY: Record<CubeCategory, PuzzleKey> = {
  '2x2': '222',
  '3x3': '333',
  '3x3 OH': '333',
  '3x3 BLD': '333ni',
  '4x4': '444',
  '4x4 BLD': '444ni',
  '5x5': '555',
  '6x6': '666',
  '7x7': '777',
  SQ1: 'sq1',
  Skewb: 'skewb',
  Pyraminx: 'pyram',
  Megaminx: 'minx',
  Clock: 'clock',
  FTO: 'fto',
  '2x2 Virtual': '222',
  '3x3 Virtual': '333'
}

export interface ScrambleEngine {
  scramble(puzzle: PuzzleKey): string
}
