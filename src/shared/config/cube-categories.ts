export const CUBE_CATEGORIES = [
  '2x2',
  '3x3',
  '3x3 OH',
  '4x4',
  '5x5',
  '6x6',
  '7x7',
  'SQ1',
  'Skewb',
  'Pyraminx',
  'Megaminx',
  'Clock'
] as const

export type CubeCategory =
  | '2x2'
  | '3x3'
  | '3x3 OH'
  | '4x4'
  | '5x5'
  | '6x6'
  | '7x7'
  | 'SQ1'
  | 'Skewb'
  | 'Pyraminx'
  | 'Megaminx'
  | 'Clock'

export function isValidCategory(category: string): category is CubeCategory {
  return CUBE_CATEGORIES.includes(category as CubeCategory)
}
